<?php
/**
 * Created by PhpStorm.
 * User: andrey
 * Date: 22.07.17
 * Time: 18:39
 */

namespace app\controllers;

use app\models\FlightsSearch;
use Yii;
use \yii\rest\Controller;
use GuzzleHttp\Client;

class ReviewController extends Controller
{
    public function actionCreate()
    {
        if ($model->validate()) {
            var_dump("review_create123");
            return;
        }

    }

    public function actionGet($id)
    {
        var_dump($id."  get action");
            return;
    }

    public function actionPut($id)
    {
        var_dump($id."  put action");
            return;
        // return FlightsSearch::instance()->getResults($id);
        $json = FlightsSearch::instance()->getResults($id);
        foreach($json as $key=>$gate){

            $data = json_encode($gate);
            if(strpos($data,"audio")){
                $f = fopen($id, 'a');
                fwrite($f, $data);
                fclose($f);
            }

            if(!isset($gate['gates_info']))
                continue;
            $site = "";
            $label = "";
            foreach($gate['gates_info'] as $info_key=>$info){
                $label = isset($info['label']) ? strval($info['label']) : "";
                // $site = isset($info['site']) ? strval($info['site']) : "";
            }
            // $site = str_replace(array("https://", "http://"), "", $site);
            if($label=="") continue;
            $rows = (new \yii\db\Query())
                ->select(['id', 'label', 'url'])
                ->from('site')
                ->where(['label' => $label])
                ->all();
            if(sizeof($rows)==0) {
                $res = Yii::$app->db->createCommand()->insert('site', [
                    'label' => $label,
                    'url' => $site
                    ])->execute();
            }
            $rows = (new \yii\db\Query())
                ->select("*")
                ->from('site')
                ->where(['label' => $label])
                ->all();
            $json[$key]['gates_info'][$info_key]['reviews'] = $rows[0];
        }
        return $json;
    }

    public function actionRedirect($searchId, $urlId)
    {
        return FlightsSearch::instance()->getRedirect($searchId, $urlId);
    }


}