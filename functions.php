<?php

/**
 * @author Denis Utkin <dizirator@gmail.com>
 * @link   https://github.com/dizirator
 */

use yii\base\InvalidParamException;

/**
 * Find application by domain name.
 */
function findApplicationByDomain() : void
{
    $default = $app = 'primary';
    $file    = ROOT_DIR . '/common/config/domains.php';
    $domains = file_exists($file) ? (array) require $file : [];
    $dir     = ROOT_DIR . '/applications/';
    foreach ($domains as  $key => $value) {
        if ($_SERVER['HTTP_HOST'] === $key) {
            $app = $value;
            break;
        }
    }
    if (!is_dir($dir . $app)) {
        $app = $default;
    }
    define('APP_NAME', $app);
    define('APP_DIR',  $dir . $app);
}

/**
 * Find application by cli.
 * @return void
 */
function findConsoleApplication() : void
{
    $app         = $default = 'primary';
    $dir         = ROOT_DIR . '/applications/';
    $app         = findArgv('app', $default);
    $interactive = (int) findArgv('app-interactive', 1);
    if (!is_dir($dir . $app)) {
        exit (formatMessage("Application [{$app}] is not found\n\n", ['fg-red']));
    }
    define('APP_NAME', $app);
    define('APP_DIR',  $dir . $app);
    if ($app !== $default && $interactive) {
        echo formatMessage("Initialize the application [{$app}] (yes|no) ?", ['fg-yellow']) . "\n";
        $answer = trim(fgets(STDIN));
        if (!empty($answer) && strncasecmp($answer, 'y', 1)) {
            exit (formatMessage("Quit initialization\n", ['fg-red']));
        }
    }
    echo formatMessage("[{$app}] application initialization\n\n", ['fg-green']);
}

/**
 * @param $key
 * @param null $value
 * @param null $default
 * @return mixed
 */
function alias($key, $value = null, $default = null) : mixed
{
    try {
        if ($value !== null) return Yii::setAlias($key, $value);
        return Yii::getAlias($key);
    } catch (InvalidParamException $e) {
        return $default;
    }
}

/**
 * Debug
 * @param  array ...$params List of parameters for debug
 * @return void
 */
function debug(...$params) : void
{
    $e     = true;  // Exit true
    $v     = false; // Var dump false
    $trace = debug_backtrace(); // Get trace
    foreach ($params as $key => $value) {
        if ($value === '-e') {  // If you change the param exit
            $e = false; unset($params[$key]);
        }
        if ($value === '-v') { // If you change the param var dump
            $v = true; unset($params[$key]);
        }
    }
    echo '<br/><strong>Debug</strong>: <pre>';
    foreach ($params as $key => $value) {
        $file = $trace[0]['file'] ?? false;
        $line = $trace[0]['line'] ?? '';
        echo "<br/><span style=\"color:#CC9900\"> ============ > {$file} [{$line}]</span><br/>";
        echo '<br/><br/><br/><span style="color:#666">';
        ob_start();
        $v ? print_r(var_dump($value)) : print_r($value);
        $output = ob_get_clean();
        if ($v) $output = substr($output, strpos($output, ':')+4);
        echo $output;
        if (!$v) echo "<br/><br/><br/>";
    }
    echo '</span></pre><br/>';
    if($e) exit();
}

/**
 * Returns true if the stream supports colorization. ANSI colors are disabled if not supported by the stream.
 *
 * - windows without ansicon
 * - not tty consoles
 *
 * @return boolean true if the stream supports ANSI colors, otherwise false.
 */
function ansiColorsSupported()
{
    return DIRECTORY_SEPARATOR === '\\'
        ? getenv('ANSICON') !== false || getenv('ConEmuANSI') === 'ON'
        : function_exists('posix_isatty') && @posix_isatty(STDOUT);
}

/**
 * Get ANSI code of style.
 * @param string $name style name
 * @return integer ANSI code of style.
 */
function getStyleCode($name)
{
    $styles = [
        'bold' => 1,
        'fg-black' => 30,
        'fg-red' => 31,
        'fg-green' => 32,
        'fg-yellow' => 33,
        'fg-blue' => 34,
        'fg-magenta' => 35,
        'fg-cyan' => 36,
        'fg-white' => 37,
        'bg-black' => 40,
        'bg-red' => 41,
        'bg-green' => 42,
        'bg-yellow' => 43,
        'bg-blue' => 44,
        'bg-magenta' => 45,
        'bg-cyan' => 46,
        'bg-white' => 47,
    ];
    return $styles[$name];
}

/**
 * Formats message using styles if STDOUT supports it.
 * @param string $message message
 * @param string[] $styles styles
 * @return string formatted message.
 */
function formatMessage($message, $styles)
{
    if (empty($styles) || !ansiColorsSupported()) {
        return $message;
    }
    return sprintf("\x1b[%sm", implode(';', array_map('getStyleCode', $styles))) . $message . "\x1b[0m";
}

/**
 * Find argument from console.
 * @param $find
 * @param null $default
 * @param bool $unset
 * @return bool|null
 */
function findArgv($find, $default = null, $unset = true)
{
    $output = false;
    foreach ($_SERVER['argv'] ?? [] as $key => $value) {
        if (stripos($value, "--{$find}=") !== false) {
            $output = trim(explode("--{$find}=", $value)[1]);
            if($unset) {
                unset($_SERVER['argv'][$key]);
            }
            break;
        }
    }
    return $output !== false ? $output : $default;
}