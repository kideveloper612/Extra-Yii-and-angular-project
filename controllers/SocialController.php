<?php
namespace app\controllers;

use Yii;
use \yii\rest\Controller;
use GuzzleHttp\Client;

class SocialController extends Controller
{
    public function actionPost($site)
    {
        $data = json_decode($site);
        if($data[0]=="facebook"){
            echo $site[1];
            // require_once("/YOUR_PATH_TO/facebook_php_sdk/facebook.php");
 
            // // initialize Facebook class using your own Facebook App credentials
            // // see: https://developers.facebook.com/docs/php/gettingstarted/#install
            // $config = array();
            // $config['appId'] = 'YOUR_APP_ID';
            // $config['secret'] = 'YOUR_APP_SECRET';
            // $config['fileUpload'] = false; // optional
            
            // $fb = new Facebook($config);
            
            // // define your POST parameters (replace with your own values)
            // $params = array(
            // "access_token" => "YOUR_ACCESS_TOKEN", // see: https://developers.facebook.com/docs/facebook-login/access-tokens/
            // "message" => "Here is a blog post about auto posting on Facebook using PHP #php #facebook",
            // "link" => "http://www.pontikis.net/blog/auto_post_on_facebook_with_php",
            // "picture" => "http://i.imgur.com/lHkOsiH.png",
            // "name" => "How to Auto Post on Facebook with PHP",
            // "caption" => "www.pontikis.net",
            // "description" => "Automatically post on Facebook with PHP using Facebook PHP SDK. How to create a Facebook app. Obtain and extend Facebook access tokens. Cron automation."
            // );
            
            // // post to Facebook
            // // see: https://developers.facebook.com/docs/reference/php/facebook-api/
            // try {
            // $ret = $fb->api('/YOUR_FACEBOOK_ID/feed', 'POST', $params);
            // echo 'Successfully posted to Facebook';
            // } catch(Exception $e) {
            // echo $e->getMessage();
            // }




            
        }elseif($data[0]=="twitter"){
            //composer require abraham/twitteroauth

            // require_once "vendor/autoload.php";
 
            // use Abraham\TwitterOAuth\TwitterOAuth;
            
            // define('CONSUMER_KEY', 'ENTER_YOUR_CONSUMER_KEY');
            // define('CONSUMER_SECRET', 'ENTER_YOUR_CONSUMER_SECRET');
            // define('ACCESS_TOKEN', 'ENTER_YOUR_ACCESS_TOKEN');
            // define('ACCESS_TOKEN_SECRET', 'ENTER_YOUR_ACCESS_TOKEN_SECRET');
            
            // $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET);
            
            // $status = 'This is a test tweet. https://artisansweb.net'; //text for your tweet.
            // $post_tweets = $connection->post("statuses/update", ["status" => $status]);










        }
        return true;
    }
}