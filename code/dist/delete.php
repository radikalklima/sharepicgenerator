<?php

require_once('lib/functions.php');

if (!isAllowed()) {
    returnJsonErrorAndDie('not allowed');
}

deleteUserLogo(getUser());
