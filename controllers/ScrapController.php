<?php
declare(strict_types = 1);
namespace app\controllers;

use app\models\ScrapData;
use Yii;
use \yii\rest\Controller;
use GuzzleHttp\Client;

class ScrapController extends Controller
{ 
    public function actionIndex()
    {
        header("Content-Type: text/plain;charset=utf-8");

        $rows = (new \yii\db\Query())
            ->select(['id', 'label', 'url'])
            ->from('site')
            ->all();
        // $url = isset($_GET['site']) ? $_GET['site'] : 'Mytrip.com';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_ENCODING, '');
        $reviews = [];
        $count = 0;
        foreach($rows as $row){
            $url = $row['url'];
            if($url=='') continue;
            curl_setopt($ch, CURLOPT_URL, "https://uk.trustpilot.com/review/$url?languages=en");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            $trustpilot = curl_exec($ch);
            if (curl_errno($ch)) {
                continue;
            }
            $src = $trustpilot;
            $revpos = strpos($src, "numberOfReviews");
            if(!$revpos) continue;
            $rev_start = strrpos(substr($src,0,$revpos), "{");
            $rev_end = strpos($src, "}", $revpos);
            $rev = substr($src, $rev_start+1, $rev_end-$rev_start-1);
            
            $revpos = strpos($src, "mainEntity");
            if(!$revpos) continue;
            $rev_start = strpos($src, "[", $revpos);
            $rev_end = strpos($src, ";", $revpos);
            $rating = substr($src, $rev_start+1, $rev_end-$rev_start-6);
            
            $reviews = [];
            $revs = explode(',', $rev);
            foreach($revs as $rev){
                $rev = explode(':', $rev);
                $reviews[str_replace('"', "", $rev[0])] = str_replace('"', "", $rev[1]);
            }

            $reviews_data = [];
            $rating = substr($rating, 1, strlen($rating)-2);
            $ratings = explode('},{', $rating);
            foreach($ratings as $rating){
                $rating = str_replace(array("[", "]", "{", "}"), "", $rating);
                $rating = explode(',"csvw:cells":', $rating);
                $key = intval(str_replace('"csvw:name":"',"",$rating[0]));
                $rating = str_replace(array('"csvw:value":"','","csvw:notes"'),"", $rating[1]);
                $rating = str_replace('"', "", $rating);
                $value = explode(":", $rating);
                $reviews_data[$key]["score"] = intval($value[0]);
                $reviews_data[$key]["rating"] = intval($value[1]);
            }
            
            Yii::$app->db->createCommand()->update('site', [
                'score' => $reviews["trustScore"],
                'rating' => $reviews_data[0]["rating"],
                'reviews' => $reviews_data[0]["score"],
                'excellent_reviews' => $reviews_data[5]["score"],
                'excellent_rating' => $reviews_data[5]["rating"],
                'great_reviews' => $reviews_data[4]["score"],
                'great_rating' => $reviews_data[4]["rating"],
                'average_reviews' => $reviews_data[3]["score"],
                'average_rating' => $reviews_data[3]["rating"],
                'poor_reviews' => $reviews_data[2]["score"],
                'poor_rating' => $reviews_data[2]["rating"],
                'bad_reviews' => $reviews_data[1]["score"],
                'bad_rating' => $reviews_data[1]["rating"],
                'scan_date' => date("Y-m-d h:i:s"),
            ], "url like '$url'")->execute();
            $review_rows = (new \yii\db\Query())
                ->select(['count(*) as count'])
                ->from('reviews')
                ->where(['label' => $row['label']])
                ->all();
            $review_count = intval($reviews_data[0]["score"]) - intval($review_rows[0]['count']);
            $review_count = intval($review_count/20) + 1;
            $page_num = 1;
            $i=0;
            while($review_count > 0){
                $card = $trustpilot;
                if(!$card) break;
                $stone = "</article";
                $dtl_row = [];
                if(!strpos($card, $stone)) break;
                while (strpos($card, $stone)){
                    $text = $this->mycat($card, '<div class="review-card"', '<article', '</article');
                    $card = substr($card, strpos($card, $stone)+strlen($stone));
                    $dtl_row['data-reviewmid'] = $this->mycat($text, 'data-reviewmid', '"', '"');
                    $review_item_count = (new \yii\db\Query())
                        ->select(['count(*) as count'])
                        ->from('reviews')
                        ->where(['data-reviewmid' => $dtl_row['data-reviewmid']])
                        ->all();
                    if($review_item_count[0]['count']>0) 
                        continue;
                    $dtl_row['data-review-domain-name'] = $this->mycat($text, 'data-review-domain-name', '"', '"');
                    $dtl_row['data-review-domain-id'] = $this->mycat($text, 'data-review-domain-id', '"', '"');
                    $dtl_row['data-review-user-id'] = $this->mycat($text, 'data-review-user-id', '"', '"');
                    $dtl_row['socialShareUrl'] = $this->mycat($text, 'socialShareUrl', '"', '"');
                    $dtl_row['consumerName'] = $this->mycat($text, 'consumerName', '"', '"');
                    $dtl = $this->mycat($text, " ", "<script", "</script>");
                    $dtl_row['stars'] = intval($this->mycat($dtl, 'stars', ':', '}'));
                    $dtl_row['businessUnitDisplayName'] = $this->mycat($dtl, 'businessUnitDisplayName', '"', '"');
                    $dtl_row['review-count'] = intval($this->mycat($text, "consumer-information__review-count", "<span>", "</span>"));
                    $dtl = $this->mycat($text, "review-content-header__dates", "<script", "</script>");
                    $dtl_row['publishedDate'] = $this->mycat($dtl, 'publishedDate', '"', '"');
                    $dtl_row['content__text'] = $this->mytrim($this->mycat($text, 'review-content__text', '>', '</p>', 1));
                    $dtl_row['label'] = $row['label'];
                    Yii::$app->db->createCommand()->insert('reviews', $dtl_row)->execute();
                    $i++;
                }
                // if($page_num==3) break;
                curl_setopt($ch, CURLOPT_URL, "https://uk.trustpilot.com/review/$url?languages=en&".(++$page_num));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 30);
                $trustpilot = curl_exec($ch);
                if (curl_errno($ch)) {
                    continue;
                    //die('fatal error: curl_exec failed, ' . curl_errno($ch) . ": " . curl_error($ch));
                }
                $review_count--;
            }
            $count++;
            echo "\n" . $count . "=> $i articles \n";
        }
        curl_close($ch);
        
        echo "Updated successfully : $count agencies";
        exit;

        return $this->render('index', ['reviews'=>$reviews, 'reviews_data'=>$reviews_data]);
    }

    public function actionGetdata()
    {
        $model = new ScrapData();
        if($model->load(Yii::$app->request->post()) && $model->validate()){
            return $this->render('entry-confirm', ['model' => $model]);
        } else {
            return $this->render('entry', ['model' => $model]);
        }


    }

    function mycat(string $text, $key, $from, $to, $offset=0) {
        $key_pos = strpos($text, $key);
        $text = substr($text, strpos($text, $from, $key_pos+strlen($key)+strlen($from))+strlen($from)+$offset);
        $text = substr($text, 0, strpos($text, $to));
        return $text;
    }

    function mytrim(string $text): string
    {
        return preg_replace("/\s+/", " ", trim($text));
    }
}

