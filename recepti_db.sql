CREATE DATABASE IF NOT EXISTS `recepti`;
USE `recepti`;

CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Predjela', NOW(), NOW()),
(2, 'Glavna jela', NOW(), NOW()),
(3, 'Deserti', NOW(), NOW()),
(4, 'Prilozi', NOW(), NOW()),
(5, 'Salate', NOW(), NOW()),
(6, 'Peciva', NOW(), NOW());

CREATE TABLE `recipes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `category_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `ingredients` text NOT NULL,
  `instructions` text NOT NULL,
  `prep_time` int(11) NOT NULL,
  `servings` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `recipes_user_id_foreign` (`user_id`),
  KEY `recipes_category_id_foreign` (`category_id`),
  CONSTRAINT `recipes_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `recipes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'Test User', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()); -- password is 'password'

INSERT INTO `recipes` (`user_id`, `category_id`, `title`, `ingredients`, `instructions`, `prep_time`, `servings`, `created_at`, `updated_at`) VALUES
(1, 2, 'Ćevapi', 'Mljeveno meso, So, Biber', 'Ispeći na roštilju.', 30, 4, NOW(), NOW());