<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'gXZ(u+-sxygzqM/K-Pj8m$$QIBLjTD0Z<S^~Otsi/x<|=0_}#I<IEsm! b $c1,o' );
define( 'SECURE_AUTH_KEY',  ';``}zr=_CU[rpGyop`-WW/wZDuvv?dW1&/]wn^vEur?5$%*c4 aI$lg6<~Iwk[r_' );
define( 'LOGGED_IN_KEY',    'm_>.s@OkU!s.@O%,#bZ rGjOhYUE);YFW2n/u0a3Ns.[gBVsq#H7H=un,A|=*Y_d' );
define( 'NONCE_KEY',        'Wk(peFFTen#~KAB/Cu)2?kltdTE8pnSsZ?6V#1PpOQM1>= dkJ?W,{:VVy K !F,' );
define( 'AUTH_SALT',        ')bm[|dL@]+R>HZE_p}= e$&Ys7Qq[m[7r2{f;@gHpa_UyN~LGrcfmP^rHi 5- 3F' );
define( 'SECURE_AUTH_SALT', 'SwP`BU.=EUBM3qyZX@r,z#m61aaWCmW&9ifh!CWP./M,L8_uttw[|aGTml{7C*+F' );
define( 'LOGGED_IN_SALT',   'Sj%-vz+{YBFOW=oak./Au}T8<r5_p1Myh7>Che>p_}hA|br7wQCggL TL7fAE94D' );
define( 'NONCE_SALT',       'uEJ-3PW[n4O%p=hB@B EEZLu4Z].I0kb){B!E1qw?fKmryUc;nPFlebv%}-,c+|X' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
