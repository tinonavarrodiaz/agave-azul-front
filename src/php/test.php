<?php
if($_SERVER["REMOTE_ADDR"] == "127.0.0.1" or $_SERVER["REMOTE_ADDR"] == "localhost"){
 echo 'trabajando local';
}else{
 echo 'trabajando NO local';
}
