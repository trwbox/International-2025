<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit6961e2a82bbd8a3bf5c1d80b2831253e
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'PHPSTL\\' => 7,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'PHPSTL\\' => 
        array (
            0 => __DIR__ . '/..' . '/chubv/php-stl/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit6961e2a82bbd8a3bf5c1d80b2831253e::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit6961e2a82bbd8a3bf5c1d80b2831253e::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit6961e2a82bbd8a3bf5c1d80b2831253e::$classMap;

        }, null, ClassLoader::class);
    }
}
