<?php
function create_response_string($status, $message, $data) {
    $arr = array('status' => $status, 'message' => $message, 'data' => $data);
    return json_encode($arr);
}