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
use app\models\Site;

class SearchController extends Controller
{
    public function actionCreate()
    {
        // $f=fopen("search_head", "r");
        // $data = fread($fp, filesize("search_head"));
        // var_dump($data);
        // fclose($f);

        $name = Yii::$app->request->post();
        $model = new FlightsSearch();

        if($name['segments']==null) {
            $model->scenario = FlightsSearch::SINGLE_CITY_ROUTE;
        }
        else {
            $model->scenario = FlightsSearch::MULTI_CITY_ROUTE;
        }

        $model->attributes = $name;

        if ($model->validate()) {

            
            // $retdata = [
            //     'status' => 'ok',
            //     'data' => $model->search(),
            // ];
            // $f=fopen("search_head", "a");
            // fwrite($f, json_encode($retdata));
            // fclose($f);
            // return $retdata;
            if($name['segments']==null) {
                $data = $model->search();
                return [
                    'status' => 'ok',
                    'data' => $data,
                ];
            } else {
                $data = $model->search_multicity();
                return [
                    'status' => 'ok',
                    'data' => $data,
                ];
            }
        }

        return [
            'status' => 'error',
            'data' => $model->getErrors(),
        ];
    }

    public function actionView($id)
    {
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