CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`external_auth_id` text,
	`email` text NOT NULL,
	`role` text DEFAULT 'editor' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`metadata` text DEFAULT '{}' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `audit_entity_idx` ON `audit_logs` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`state_or_postcode` text NOT NULL,
	`preferred_contact_method` text NOT NULL,
	`message` text NOT NULL,
	`marketing_consent` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`source_page` text NOT NULL,
	`notification_status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `enquiries_status_idx` ON `enquiries` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `enquiry_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`enquiry_id` text NOT NULL,
	`author_id` text NOT NULL,
	`note` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`enquiry_id`) REFERENCES `enquiries`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `features` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text DEFAULT 'General' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `features_name_unique` ON `features` (`name`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`window_started_at` integer NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vehicle_slug_redirects` (
	`old_slug` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `vehicle_features` (
	`vehicle_id` text NOT NULL,
	`feature_id` text NOT NULL,
	PRIMARY KEY(`vehicle_id`, `feature_id`),
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`feature_id`) REFERENCES `features`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `vehicle_images` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`storage_key` text NOT NULL,
	`alt_text` text NOT NULL,
	`width` integer,
	`height` integer,
	`display_order` integer DEFAULT 0 NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `vehicle_images_vehicle_idx` ON `vehicle_images` (`vehicle_id`,`display_order`);--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`stock_number` text NOT NULL,
	`year` integer NOT NULL,
	`make` text NOT NULL,
	`model` text NOT NULL,
	`variant` text DEFAULT '' NOT NULL,
	`headline` text NOT NULL,
	`short_description` text NOT NULL,
	`full_description` text NOT NULL,
	`price_cents` integer,
	`price_display` text DEFAULT 'POA' NOT NULL,
	`price_qualifier` text DEFAULT 'Price on application' NOT NULL,
	`availability_status` text DEFAULT 'draft' NOT NULL,
	`odometer_km` integer,
	`body_type` text,
	`fuel_type` text,
	`engine` text,
	`power` text,
	`torque` text,
	`transmission` text,
	`drivetrain` text,
	`exterior_colour` text,
	`interior_colour` text,
	`seating_capacity` integer,
	`towing_capacity` text,
	`vin` text,
	`public_vin` integer DEFAULT false NOT NULL,
	`registration_status` text,
	`compliance_status` text,
	`conversion_provider` text DEFAULT 'SCD Direct' NOT NULL,
	`location` text,
	`featured` integer DEFAULT false NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`published_at` text,
	`is_sample` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`archived_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehicles_slug_unique` ON `vehicles` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `vehicles_stock_number_unique` ON `vehicles` (`stock_number`);--> statement-breakpoint
CREATE INDEX `vehicles_public_idx` ON `vehicles` (`published`,`archived_at`,`availability_status`);

-- SCD Direct live inventory captured 2026-07-24T00:00:00+10:00
UPDATE `vehicles` SET `published` = 0, `archived_at` = '2026-07-24T00:00:00+10:00' WHERE `is_sample` = 1;
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-3981809','2025-ford-f350-lariat-0002','0002',2025,'Ford','F350','Lariat','Grey Lariat sourced, converted and held by SCD Direct','This exact 2025 Ford F350 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','2026 Ford F-350 Lariat 4x4 – High Output 6.7L Power Stroke, 10-Speed Auto – AEV DualSport Build, 40s, FXL Graphics

Highlights:
High Output 6.7L Power Stroke turbo diesel10-speed automatic, 4x4Lariat trim with FXL graphic package

AEV Upfit Package:
AEV steel front bumperAEV high-clearance rear bumperAEV HighMark fendersAEV 4-inch DualSport RT suspensionAEV-tuned Bilstein shocks18-inch AEV Katmai DualSport wheels40-inch BFGoodrich HD-Terrain T/A KT tires

Why it stands out:
Serious off-road capability with 40s and AEV DualSport geometryTough protection with AEV steel bumpersClean, aggressive look with FXL graphics and HighMark fendersLariat comfort, tech, and towing strength of the HO dieselAvailable after SeptemberFully Australian approved can be registered in all statesNo mod plate required

Includes RHD Conversion and Compliance.',25900000,'$259,000','Excluding government charges and on-road costs.','in_stock',100,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','372.8 kW (SCD listing)',NULL,'Automatic','4X4','Grey','Grey',5,NULL,'1FT8W3BM7TED85986',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',1,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981809-image-1','scd-3981809','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981809-0002-e0806e3f-25f9-55a4-82fa-ae0d3ab25466.jpg','2025 Ford F350 Lariat stock 0002, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981809-image-2','scd-3981809','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981809-0002-a2912aa1-72e6-53fb-a14c-013fa5206186.jpg','2025 Ford F350 Lariat stock 0002, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981809-image-3','scd-3981809','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981809-0002-bc99e6a5-178e-5c0f-982b-255cb4f3a6fd.jpg','2025 Ford F350 Lariat stock 0002, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981809-image-4','scd-3981809','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981809-0002-1da12ecf-3fef-5c77-a07a-24336bc781df.jpg','2025 Ford F350 Lariat stock 0002, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981809','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981809','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981809','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981809','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981809','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-aev-off-road-upfit','AEV off-road upfit','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981809','scd-feature-aev-off-road-upfit');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-40-inch-bfgoodrich-tyres','40-inch BFGoodrich tyres','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981809','scd-feature-40-inch-bfgoodrich-tyres');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-3981810','2025-ford-f450-platinum-0001','0001',2025,'Ford','F450','Platinum','Grey Platinum sourced, converted and held by SCD Direct','This exact 2025 Ford F450 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','2026 Ford F-450 Platinum Plus 4x4 – Marsh Grey – High Output 6.7L Power Stroke, 10-Speed Auto Standout heavy-duty luxury and capability with show-stopping looks and serious hardware.

Highlights:
High Output 6.7L Turbo Diesel Power Stroke10-speed automatic transmission4x4, Platinum Plus trimExterior colour: Marsh Grey$45,000 in Upgrades/Up fit:Colour-matched front and rear barsPainted Front splitterPainted fog light bezelsPainted tailgate plaquePainted rear stepCarli 3.5" Pin Top suspension lift37" tyres on 24" wheels

Why you’ll love it:
Massive towing and hauling capability with HO dieselPremium Platinum Plus comfort and techHead-turning, fully colour-matched aestheticProven Carli suspension for ride quality and stance

Includes RHD Conversion and Compliance.',29200000,'$292,000','Excluding government charges and on-road costs.','in_stock',100,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','354.5 kW (SCD listing)',NULL,'Automatic','4X4','Grey','Grey',5,NULL,'1FT8W4DM8TED75275',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',0,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981810-image-1','scd-3981810','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981810-0001-3a3613ba-35b5-5200-abdf-0c3c70da9475.jpg','2025 Ford F450 Platinum stock 0001, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981810-image-2','scd-3981810','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981810-0001-a7f49a13-49b3-539e-b1b0-906b25eeebdf.jpg','2025 Ford F450 Platinum stock 0001, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981810-image-3','scd-3981810','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981810-0001-c7b06f2c-7a58-5787-a87e-e3d439865f74.jpg','2025 Ford F450 Platinum stock 0001, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981810-image-4','scd-3981810','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981810-0001-836787ba-7db6-5309-ac1c-7ae982e4cd5b.jpg','2025 Ford F450 Platinum stock 0001, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981810','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981810','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981810','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981810','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981810','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-carli-suspension-upgrade','Carli suspension upgrade','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981810','scd-feature-carli-suspension-upgrade');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-37-inch-tyres','37-inch tyres','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981810','scd-feature-37-inch-tyres');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-3981811','2025-ford-f450-platinum-0670','0670',2025,'Ford','F450','Platinum','Beige Platinum sourced, converted and held by SCD Direct','This exact 2025 Ford F450 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','2026 Ford F-450 Platinum Plus Crew Cab 4X4 Dually, lifted with a 2.5-inch Icon Dual Rate Lift Springs, Fox 2.0 Smooth Body Shocks, and 26-inch JTX Gloss Black Wheels. Powered by a TurboCharged 6.7L PowerStroke High Ouput Diesel V8, it delivers 500hp and 1200lb-ft of torque. Features include LED lighting, heated/ventilated leather seats, dual-zone climate control, and a B O Unleashed sound system.

Includes RHD Conversion and Compliance.',29200000,'$292,000','Excluding government charges and on-road costs.','in_stock',2500,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','354.5 kW (SCD listing)','1,200 lb-ft (SCD listing)','Automatic','4X4','Beige','Brown',5,NULL,'1FT8W4DM6TEC00278',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',0,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981811-image-1','scd-3981811','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981811-0670-763f3c82-dd13-5dd9-9a4f-4e1baa8b69d0.jpg','2025 Ford F450 Platinum stock 0670, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981811-image-2','scd-3981811','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981811-0670-c37ca798-4680-5d70-a4d0-25ae45563eaf.jpg','2025 Ford F450 Platinum stock 0670, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981811-image-3','scd-3981811','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981811-0670-989eabf5-f9a6-551e-be85-69765e76a043.jpg','2025 Ford F450 Platinum stock 0670, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981811-image-4','scd-3981811','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981811-0670-d766d658-5fa2-5f07-a2c7-49a2039be658.jpg','2025 Ford F450 Platinum stock 0670, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981811','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981811','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981811','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981811','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981811','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-b-o-premium-audio','B&O premium audio','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981811','scd-feature-b-o-premium-audio');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-heated-and-ventilated-front-seats','Heated and ventilated front seats','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981811','scd-feature-heated-and-ventilated-front-seats');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-3981812','2025-ford-f450-platinum-ted94170','TED94170',2025,'Ford','F450','Platinum','Black Platinum sourced, converted and held by SCD Direct','This exact 2025 Ford F450 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','Introducing the 2026 Ford F-450 Super Duty Platinum DRW - a true workhorse built to handle the toughest jobs with uncompromising capability and refined luxury. This exceptional vehicle is now available at our dealership, and we''re excited to showcase its impressive features.- 360 degree Camera- Adaptive Cruise Control- Blind-Spot Monitors- B&O Unleashed Sound System by Bang & Olufsen- Front dual zone A/C- Twin Panel Power MoonroofPowered by the renowned Power Stroke 6.7L V8 DI 32V OHV Turbodiesel engine, this F-450SD delivers unparalleled performance and efficiency. Paired with a 10-Speed Automatic transmission and 4WD, it''s ready to tackle any terrain or towing challenge with ease.

Beyond the impressive mechanical capabilities, this F-450SD is also packed with a wealth of premium features that elevate the driving experience. From the advanced SYNC 4 infotainment system to the luxurious leather-wrapped steering wheel and heated/ventilated front seats, every detail has been meticulously crafted to provide maximum comfort and convenience.

Safety and technology are also top priorities, with features like Blind-Spot Monitoring, Adaptive Cruise Control, and a 360-degree camera system ensuring you can navigate confidently, whether on the job site or the open road.

Conversion by Introducing the 2026 Ford F-450SD Platinum DRW - a true workhorse built to handle the toughest jobs with uncompromising capability and refined luxury. This exceptional vehicle is now available at our dealership, and we''re excited to showcase its impressive features.- 360 degree Camera- Adaptive Cruise Control- Blind-Spot Monitors- B&O Unleashed Sound System by Bang & Olufsen- Front dual zone A/C- Twin Panel Power MoonroofPowered by the renowned Power Stroke 6.7L V8 DI 32V OHV Turbodiesel engine, this F-450SD delivers unparalleled performance and efficiency. Paired with a 10-Speed Automatic transmission and 4WD, it''s ready to tackle any terrain or towing challenge with ease.

Beyond the impressive mechanical capabilities, this F-450SD is also packed with a wealth of premium features that elevate the driving experience. From the advanced SYNC 4 infotainment system to the luxurious leather-wrapped steering wheel and heated/ventilated front seats, every detail has been meticulously crafted to provide maximum comfort and convenience.

Safety and technology are also top priorities, with features like Blind-Spot Monitoring, Adaptive Cruise Control, and a 360-degree camera system ensuring you can navigate confidently, whether on the job site or the open road.',24700000,'$247,000','Excluding government charges and on-road costs.','in_stock',48,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','354.5 kW (SCD listing)',NULL,'Automatic','4X4','Black','Black',5,NULL,'1FT8W4DT2TED94170',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',0,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981812-image-1','scd-3981812','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981812-TED94170-8d12a504-e161-5a47-b5ae-6b5478b64f64.jpg','2025 Ford F450 Platinum stock TED94170, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981812-image-2','scd-3981812','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981812-TED94170-5ac72749-616f-5e5b-8d77-8dcfdbfee43b.jpg','2025 Ford F450 Platinum stock TED94170, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981812-image-3','scd-3981812','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981812-TED94170-ac4b48ca-5524-59c4-96c9-1a1d05cb287d.jpg','2025 Ford F450 Platinum stock TED94170, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981812-image-4','scd-3981812','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981812-TED94170-f50ec4f3-7abf-573b-8cab-406084158258.jpg','2025 Ford F450 Platinum stock TED94170, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981812','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981812','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981812','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981812','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981812','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-360-degree-camera','360-degree camera','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981812','scd-feature-360-degree-camera');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-adaptive-cruise-control','Adaptive cruise control','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981812','scd-feature-adaptive-cruise-control');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-blind-spot-monitoring','Blind-spot monitoring','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981812','scd-feature-blind-spot-monitoring');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-b-o-premium-audio','B&O premium audio','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981812','scd-feature-b-o-premium-audio');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-heated-and-ventilated-front-seats','Heated and ventilated front seats','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981812','scd-feature-heated-and-ventilated-front-seats');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-panoramic-roof','Panoramic roof','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981812','scd-feature-panoramic-roof');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-3981813','2025-ford-f450-platinum-0004','0004',2025,'Ford','F450','Platinum','Beige Platinum sourced, converted and held by SCD Direct','This exact 2025 Ford F450 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','2026 SCD Ford F-450 Platinum Plus – Super Single – HO 6.7L Power Stroke Turbo Diesel

Highlights:
High Output 6.7L Power Stroke turbo dieselPlatinum Plus trimSuper Single conversion5.5" Carli Pin top suspension (front/rear)Heavy-duty front and rear bars (bumpers)Warn 16.5ti-s winch365/80R20 Goodyear tires20" wheels

Why it stands out:
Exceptional ride control Serious recovery capability with Warn 16.5ti-sPremium lighting for night and off-roadMassive footprint and durability with 365/80r20 on wheelsLuxury Platinum Plus comfort and tech

Includes RHD Conversion and Compliance.',29500000,'$295,000','Excluding government charges and on-road costs.','in_stock',100,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','354.5 kW (SCD listing)',NULL,'Automatic','4X4','Beige','Beige',5,NULL,'1FT8W4DM3TEE84775',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',0,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981813-image-1','scd-3981813','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981813-0004-8ed87c0e-089a-514b-8ee0-1fc7af67805b.jpg','2025 Ford F450 Platinum stock 0004, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981813-image-2','scd-3981813','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981813-0004-1a39a88c-82d7-5201-8bd3-1ce0e81dd9b9.jpg','2025 Ford F450 Platinum stock 0004, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981813-image-3','scd-3981813','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981813-0004-12fee097-5eef-57c8-80ab-3ec3877bed5d.jpg','2025 Ford F450 Platinum stock 0004, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-3981813-image-4','scd-3981813','https://cdn.images.stock.i-motor.net.au/vehicles/large/3981813-0004-80ba03e2-c8a0-5d19-b777-3b6c84662519.jpg','2025 Ford F450 Platinum stock 0004, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981813','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981813','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981813','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981813','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981813','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-carli-suspension-upgrade','Carli suspension upgrade','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981813','scd-feature-carli-suspension-upgrade');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-warn-16-5ti-s-winch','Warn 16.5ti-s winch','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981813','scd-feature-warn-16-5ti-s-winch');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-super-single-conversion','Super Single conversion','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-3981813','scd-feature-super-single-conversion');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-4013119','2026-ford-f350-platinum-d96967','D96967',2026,'Ford','F350','Platinum','White Platinum sourced, converted and held by SCD Direct','This exact 2026 Ford F350 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','2026 SCD Ford F-350 Super Duty Platinum 4x4 | Star White | High Output 6.7L Power Stroke Turbo Diesel | RHD ConvertedPremium American heavy-duty pickup, combining serious towing capability, Platinum luxury specification and professional right-hand drive conversion.

This Ford F-350 Super Duty Platinum is built for buyers wanting more than a standard ute. Powered by the High Output 6.7L Power Stroke turbo diesel and paired with Ford’s 10-speed automatic transmission, the F-350 delivers strong performance, heavy-duty capability and long-distance comfort.

Key Features:
• 2026 Ford F-350 Super Duty Crew Cab 4x4
• Platinum luxury trim
• Star White Metallic Tri-coat Exterior with Black Onyx Platinum leather interior
• 6.7L Power Stroke turbo diesel with 10-speed automatic transmission
• Large touchscreen infotainment system
• Advanced driver assistance and safety technology
• Heavy-duty towing and payload capability
•

Includes RHD conversion and Australian complianceWhy this F-350 stands out:The F-350 Super Duty Platinum combines the strength of a full-size American heavy-duty truck with the comfort and refinement expected from a premium vehicle. It is ideal for towing, touring, work use or buyers wanting a luxury pickup with serious road presence.

Professionally prepared by for Australian use, including right-hand drive conversion and compliance.',23250700,'$232,507','Excluding government charges and on-road costs.','in_stock',11,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','372.8 kW (SCD listing)',NULL,'Automatic','4X4','White','Black',5,NULL,'1FT8W3BM3TED96967',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',1,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013119-image-1','scd-4013119','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013119-D96967-bd6a4aa5-7359-5dc6-bd98-2ff38326919a.jpg','2026 Ford F350 Platinum stock D96967, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013119-image-2','scd-4013119','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013119-D96967-134eb6f6-b48f-5ef9-92bd-6ef88c58e353.jpg','2026 Ford F350 Platinum stock D96967, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013119-image-3','scd-4013119','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013119-D96967-411e01a1-0c1a-57db-b0d4-fce6c3f9304f.jpg','2026 Ford F350 Platinum stock D96967, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013119-image-4','scd-4013119','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013119-D96967-3e2ad391-ba08-5024-9811-11ac0964c054.jpg','2026 Ford F350 Platinum stock D96967, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013119','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013119','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013119','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013119','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013119','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-4013120','2026-ford-f350-platinum-c37445','C37445',2026,'Ford','F350','Platinum','Black Platinum sourced, converted and held by SCD Direct','This exact 2026 Ford F350 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','2026 Ford F-350 Super Duty Platinum 4x4 | Black | High Output 6.7L Power Stroke Turbo Diesel | RHD ConvertedPremium American heavy-duty pickup, combining serious towing capability, Platinum luxury specification and professional right-hand drive conversion.

This Ford F-350 Super Duty Platinum is built for buyers wanting more than a standard ute. Powered by the High Output 6.7L Power Stroke turbo diesel and paired with Ford’s 10-speed automatic transmission, the F-350 delivers strong performance, heavy-duty capability and long-distance comfort.

Key Features:
• 2026 Ford F-350 Super Duty Crew Cab 4x4
• Platinum luxury trim
• Black Metallic exterior with Black Onyx Platinum leather interior
• 6.7L Power Stroke turbo diesel with 10-speed automatic transmission
• Large touchscreen infotainment system
• Advanced driver assistance and safety technology
• Heavy-duty towing and payload capability
•

Includes RHD conversion and Australian complianceWhy this F-350 stands out:The F-350 Super Duty Platinum combines the strength of a full-size American heavy-duty truck with the comfort and refinement expected from a premium vehicle. It is ideal for towing, touring, work use or buyers wanting a luxury pickup with serious road presence.

Professionally prepared by for Australian use, including right-hand drive conversion and compliance.',23250700,'$232,507','Excluding government charges and on-road costs.','in_stock',100,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','372.8 kW (SCD listing)',NULL,'Automatic','4X4','Black','Black',5,NULL,'1FT8W3BM1TEC37445',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',0,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013120-image-1','scd-4013120','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013120-C37445-c8a5178c-2cdc-5baa-b848-a0e135fcd102.jpg','2026 Ford F350 Platinum stock C37445, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013120-image-2','scd-4013120','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013120-C37445-620b1be4-d9eb-5b02-830a-28160837bc86.jpg','2026 Ford F350 Platinum stock C37445, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013120-image-3','scd-4013120','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013120-C37445-953420fc-b8f0-5678-a5ca-d8cb15b8306c.jpg','2026 Ford F350 Platinum stock C37445, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013120-image-4','scd-4013120','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013120-C37445-e087e031-f1ba-5f89-8cf8-8639467cbc0c.jpg','2026 Ford F350 Platinum stock C37445, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013120','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013120','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013120','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013120','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013120','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-4013121','2026-ford-f350-platinum-e38924','E38924',2026,'Ford','F350','Platinum','White Platinum sourced, converted and held by SCD Direct','This exact 2026 Ford F350 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','2026 SCD Ford F-350 Super Duty Platinum Plus 4x4 | Avalanche | High Output 6.7L Power Stroke Turbo Diesel | RHD ConvertedPremium American heavy-duty pickup, combining serious towing capability, Platinum luxury specification and professional right-hand drive conversion.

This Ford F-350 Super Duty Platinum is built for buyers wanting more than a standard ute. Powered by the High Output 6.7L Power Stroke turbo diesel and paired with Ford’s 10-speed automatic transmission, the F-350 delivers strong performance, heavy-duty capability and long-distance comfort.

Key Features:
• 2026 Ford F-350 Super Duty Crew Cab 4x4
• Platinum Plus luxury trim
• Avalanche Exterior with Smoked Truffle Unique Platinum leather interior
• 6.7L Power Stroke turbo diesel with 10-speed automatic transmission
• Large touchscreen infotainment system
• Advanced driver assistance and safety technology
• Heavy-duty towing and payload capability
•

Includes RHD conversion and Australian complianceWhy this F-350 stands out:The F-350 Super Duty Platinum combines the strength of a full-size American heavy-duty truck with the comfort and refinement expected from a premium vehicle. It is ideal for towing, touring, work use or buyers wanting a luxury pickup with serious road presence.

Professionally prepared by for Australian use, including right-hand drive conversion and compliance.',23793200,'$237,932','Excluding government charges and on-road costs.','in_stock',115,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','372.8 kW (SCD listing)',NULL,'Automatic','4X4','White','Black',5,NULL,'1FT8W3BMXTEE38924',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',0,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013121-image-1','scd-4013121','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013121-E38924-fee13f22-5572-5927-aaab-101a723d16af.jpg','2026 Ford F350 Platinum stock E38924, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013121-image-2','scd-4013121','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013121-E38924-5bc15aed-c05c-5740-8b8c-c09ff30086f7.jpg','2026 Ford F350 Platinum stock E38924, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013121-image-3','scd-4013121','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013121-E38924-f0ca62c3-e461-53d3-8bd0-749e16b09b7c.jpg','2026 Ford F350 Platinum stock E38924, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013121-image-4','scd-4013121','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013121-E38924-9b03960b-54dd-5bba-8fa2-0b6cee1ee1f7.jpg','2026 Ford F350 Platinum stock E38924, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013121','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013121','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013121','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013121','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013121','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-4013158','2026-ford-f350-platinum-c77025','C77025',2026,'Ford','F350','Platinum','Grey Platinum sourced, converted and held by SCD Direct','This exact 2026 Ford F350 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','2026 SCD Ford F-350 Super Duty Platinum 4x4 | Carbonized Grey | High Output 6.7L Power Stroke Turbo Diesel | RHD ConvertedPremium American heavy-duty pickup, combining serious towing capability, Platinum luxury specification and professional right-hand drive conversion.

This Ford F-350 Super Duty Platinum is built for buyers wanting more than a standard ute. Powered by the High Output 6.7L Power Stroke turbo diesel and paired with Ford’s 10-speed automatic transmission, the F-350 delivers strong performance, heavy-duty capability and long-distance comfort.

Key Features:
• 2026 Ford F-350 Super Duty Crew Cab 4x4
• Platinum luxury trim
• Carbonized Grey Exterior with Black Onyx Platinum leather interior
• 6.7L Power Stroke turbo diesel with 10-speed automatic transmission
• Panoramic roof
• Large touchscreen infotainment system
• Advanced driver assistance and safety technology
• Heavy-duty towing and payload capability
•

Includes RHD conversion and Australian complianceWhy this F-350 stands out:The F-350 Super Duty Platinum combines the strength of a full-size American heavy-duty truck with the comfort and refinement expected from a premium vehicle. It is ideal for towing, touring, work use or buyers wanting a luxury pickup with serious road presence.

Professionally prepared by for Australian use, including right-hand drive conversion and compliance.',23250700,'$232,507','Excluding government charges and on-road costs.','in_stock',100,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','372.8 kW (SCD listing)',NULL,'Automatic','4X4','Grey','Black',5,NULL,'1FT8W3BM3TEC77025',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',0,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013158-image-1','scd-4013158','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013158-C77025-04baf837-8d87-5e89-8172-c52e2df00324.jpg','2026 Ford F350 Platinum stock C77025, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013158-image-2','scd-4013158','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013158-C77025-d798a709-af1f-5728-b47f-cf015630ed87.jpg','2026 Ford F350 Platinum stock C77025, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013158-image-3','scd-4013158','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013158-C77025-44022b17-b300-54a9-8c61-9c33509dff72.jpg','2026 Ford F350 Platinum stock C77025, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4013158-image-4','scd-4013158','https://cdn.images.stock.i-motor.net.au/vehicles/large/4013158-C77025-aca30d40-c7a7-5707-aa60-ebf029a502fb.jpg','2026 Ford F350 Platinum stock C77025, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013158','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013158','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013158','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013158','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013158','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-panoramic-roof','Panoramic roof','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4013158','scd-feature-panoramic-roof');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-4018153','2026-ford-f350-xlt-c82887','C82887',2026,'Ford','F350','XLT','Grey XLT sourced, converted and held by SCD Direct','This exact 2026 Ford F350 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','2026 Ford F-350 Super Duty XLT 4x4 | Carbonized Gray Metallic | High Output 6.7L Power Stroke Turbo Diesel | RHD ConvertedPremium American heavy-duty pickup, combining serious towing capability, practical XLT specification and professional right-hand drive conversion.

This Ford F-350 Super Duty XLT is built for buyers wanting the size, strength and presence of a full-size American pickup in a clean, practical specification. Powered by the High Output 6.7L Power Stroke turbo diesel and paired with Ford’s 10-speed automatic transmission, the F-350 delivers strong performance, heavy-duty capability and everyday usability.

Key Features:
• 2026 Ford F-350 Super Duty Crew Cab 4x4
• XLT trim
• Carbonized Gray Metallic exterior with Medium Dark Slate cloth interior
• High Output 6.7L Power Stroke turbo diesel with 10-speed automatic transmission
• 6.75 ft Styleside bed
• SYNC 4 with 8-inch multifunction display
• Rear-view camera, collision mitigation and cruise control
• Power sliding rear window, privacy glass and power rear side windows
•

Includes RHD conversion and Australian complianceWhy this F-350 stands out:The F-350 Super Duty XLT gives buyers the core strength and road presence of Ford’s heavy-duty platform in a practical, usable specification. It is ideal for towing, touring, business use, trade use or buyers wanting a serious American pickup without unnecessary luxury extras.

Professionally prepared by for Australian use, including right-hand drive conversion and compliance.',18900000,'$189,000','Excluding government charges and on-road costs.','in_stock',15,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','372.8 kW (SCD listing)',NULL,'Automatic','4X4','Grey','Grey',5,NULL,'1FT8W3BT6TEC82887',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',0,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4018153-image-1','scd-4018153','https://cdn.images.stock.i-motor.net.au/vehicles/large/4018153-C82887-6c811468-e6ee-5bce-bcd1-5a5fe9067adb.jpg','2026 Ford F350 XLT stock C82887, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4018153-image-2','scd-4018153','https://cdn.images.stock.i-motor.net.au/vehicles/large/4018153-C82887-cf2df0a1-84b8-55b3-a7e2-bb021173e035.jpg','2026 Ford F350 XLT stock C82887, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4018153-image-3','scd-4018153','https://cdn.images.stock.i-motor.net.au/vehicles/large/4018153-C82887-3c1fb438-8b72-50ad-853c-44cefe2eed96.jpg','2026 Ford F350 XLT stock C82887, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4018153-image-4','scd-4018153','https://cdn.images.stock.i-motor.net.au/vehicles/large/4018153-C82887-654bac47-2e2d-5ab5-9769-41ebe84071e0.jpg','2026 Ford F350 XLT stock C82887, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018153','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018153','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018153','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018153','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018153','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-4018155','2026-ford-f350-xlt-e60694','E60694',2026,'Ford','F350','XLT','Black XLT sourced, converted and held by SCD Direct','This exact 2026 Ford F350 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','2026 Ford F-350 Super Duty XLT 4x4 | Agate Black Metallic | High Output 6.7L Power Stroke Turbo Diesel | RHD ConvertedPremium American heavy-duty pickup, combining serious towing capability, practical XLT specification and professional right-hand drive conversion.

This Ford F-350 Super Duty XLT is built for buyers wanting the size, strength and presence of a full-size American pickup in a clean, practical specification. Powered by the High Output 6.7L Power Stroke turbo diesel and paired with Ford’s 10-speed automatic transmission, the F-350 delivers strong performance, heavy-duty capability and everyday usability.

Key Features:
• 2026 Ford F-350 Super Duty Crew Cab 4x4
• XLT trim
• Agate Black Metallic exterior with Medium Dark Slate cloth interior
• High Output 6.7L Power Stroke turbo diesel with 10-speed automatic transmission
• 6.75 ft Styleside bed
• SYNC 4 with 8-inch multifunction display
• Rear-view camera, collision mitigation and cruise control
• Power sliding rear window, privacy glass and power rear side windows
•

Includes RHD conversion and Australian complianceWhy this F-350 stands out:The F-350 Super Duty XLT gives buyers the core strength and road presence of Ford’s heavy-duty platform in a practical, usable specification. It is ideal for towing, touring, business use, trade use or buyers wanting a serious American pickup without unnecessary luxury extras.

Professionally prepared by for Australian use, including right-hand drive conversion and compliance.',18900000,'$189,000','Excluding government charges and on-road costs.','in_stock',50,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','372.8 kW (SCD listing)',NULL,'Automatic','4X4','Black','Grey',5,NULL,'1FT8W3BN7TEE60694',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',0,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4018155-image-1','scd-4018155','https://cdn.images.stock.i-motor.net.au/vehicles/large/4018155-E60694-d747fc3a-bb8a-50da-8391-77b38f95c420.jpg','2026 Ford F350 XLT stock E60694, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4018155-image-2','scd-4018155','https://cdn.images.stock.i-motor.net.au/vehicles/large/4018155-E60694-4174e1ed-a611-5a06-b8d5-9abf9031193f.jpg','2026 Ford F350 XLT stock E60694, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4018155-image-3','scd-4018155','https://cdn.images.stock.i-motor.net.au/vehicles/large/4018155-E60694-e5d3043d-20e4-5273-8f26-1729e3b77088.jpg','2026 Ford F350 XLT stock E60694, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4018155-image-4','scd-4018155','https://cdn.images.stock.i-motor.net.au/vehicles/large/4018155-E60694-ba02bf32-7aab-55cb-bd9d-cf9241f44150.jpg','2026 Ford F350 XLT stock E60694, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018155','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018155','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018155','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018155','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018155','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-4018156','2026-ford-f350-xlt-d54436','D54436',2026,'Ford','F350','XLT','White XLT sourced, converted and held by SCD Direct','This exact 2026 Ford F350 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','2026 Ford F-350 Super Duty XLT 4x4 | Avalanche | High Output 6.7L Power Stroke Turbo Diesel | RHD ConvertedPremium American heavy-duty pickup, combining serious towing capability, upgraded XLT specification and professional right-hand drive conversion.

This Ford F-350 Super Duty XLT is built for buyers wanting the size, strength and presence of a full-size American pickup with a strong mix of practical features, technology and towing equipment. Powered by the High Output 6.7L Power Stroke turbo diesel and paired with Ford’s 10-speed automatic transmission, the F-350 delivers strong performance, heavy-duty capability and everyday usability.

Key Features:
• 2026 Ford F-350 Super Duty Crew Cab 4x4
• XLT trim with Premium Package and Black Appearance Package
• Avalanche exterior with Medium Dark Slate cloth interior
• High Output 6.7L Power Stroke turbo diesel with 10-speed automatic transmission
• 6.75 ft Styleside bed
• SYNC 4 with 12-inch multifunction display and connected navigation
• Front, side and rear-view camera system, reverse parking aid and collision mitigation
• Heated front seats, privacy glass, power sliding rear window and power rear side windows
•

Includes RHD conversion and Australian complianceWhy this F-350 stands out:The F-350 Super Duty XLT gives buyers the core strength and road presence of Ford’s heavy-duty platform with a higher-value XLT specification. It is ideal for towing, touring, business use, trade use or buyers wanting a serious American pickup with practical comfort, useful technology and strong visual presence.

Professionally prepared by for Australian use, including right-hand drive conversion and compliance.',19900000,'$199,000','Excluding government charges and on-road costs.','in_stock',50,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','372.8 kW (SCD listing)',NULL,'Automatic','4X4','White','Grey',5,NULL,'1FT8W3BM4TED54436',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',0,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4018156-image-1','scd-4018156','https://cdn.images.stock.i-motor.net.au/vehicles/large/4018156-D54436-ae3737fd-bbfb-5133-9356-585dbe22de1c.jpg','2026 Ford F350 XLT stock D54436, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4018156-image-2','scd-4018156','https://cdn.images.stock.i-motor.net.au/vehicles/large/4018156-D54436-fe78eeb4-4d0d-50d2-8c13-75d08de231e2.jpg','2026 Ford F350 XLT stock D54436, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4018156-image-3','scd-4018156','https://cdn.images.stock.i-motor.net.au/vehicles/large/4018156-D54436-61fd7c2a-eb72-5cef-ae7b-4d00f9898808.jpg','2026 Ford F350 XLT stock D54436, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4018156-image-4','scd-4018156','https://cdn.images.stock.i-motor.net.au/vehicles/large/4018156-D54436-ea488c7f-3bac-5797-a830-d096a2ccff21.jpg','2026 Ford F350 XLT stock D54436, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018156','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018156','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018156','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018156','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018156','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-black-appearance-package','Black Appearance Package','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4018156','scd-feature-black-appearance-package');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-4031936','2026-ford-f450-platinum-ted97444','TED97444',2026,'Ford','F450','Platinum','Black Platinum sourced, converted and held by SCD Direct','This exact 2026 Ford F450 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','2026 Ford F-450 Platinum Plus 4x4 – Black – High Output 6.7L Power Stroke, 10-Speed AutoStandout heavy-duty luxury and capability with show-stopping looks and serious hardware.

Highlights:
High Output 6.7L Turbo Diesel Power Stroke10-speed automatic transmission4x4, Platinum Plus trimExterior colour: Black$45,000 in Upgrades/Up fit:Colour-matched front and rear barsPainted Front splitterPainted fog light bezelsPainted tailgate plaquePainted rear stepCarli 3.5" Pin Top suspension lift37" tyres on 24" wheels

Why you’ll love it:
Massive towing and hauling capability with HO dieselPremium Platinum Plus comfort and techHead-turning, fully colour-matched aestheticProven Carli suspension for ride quality and stance

Includes RHD Conversion and Compliance.',29200000,'$292,000','Excluding government charges and on-road costs.','in_stock',100,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','354.5 kW (SCD listing)',NULL,'Automatic','4X4','Black','Beige',5,NULL,'1FT8W4DM5TED97444',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',1,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4031936-image-1','scd-4031936','https://cdn.images.stock.i-motor.net.au/vehicles/large/4031936-TED97444-113b423f-bee9-5bdc-a25e-afe313a34feb.jpg','2026 Ford F450 Platinum stock TED97444, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4031936-image-2','scd-4031936','https://cdn.images.stock.i-motor.net.au/vehicles/large/4031936-TED97444-9c673783-2cfa-55d0-9848-b408d32b4784.jpg','2026 Ford F450 Platinum stock TED97444, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4031936-image-3','scd-4031936','https://cdn.images.stock.i-motor.net.au/vehicles/large/4031936-TED97444-a308c7ed-8bfc-52a8-ad36-8547187fee08.jpg','2026 Ford F450 Platinum stock TED97444, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4031936-image-4','scd-4031936','https://cdn.images.stock.i-motor.net.au/vehicles/large/4031936-TED97444-dca9fee8-2500-58f7-a9cb-45c5bf3096a7.jpg','2026 Ford F450 Platinum stock TED97444, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031936','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031936','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031936','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031936','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031936','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-carli-suspension-upgrade','Carli suspension upgrade','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031936','scd-feature-carli-suspension-upgrade');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-37-inch-tyres','37-inch tyres','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031936','scd-feature-37-inch-tyres');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-4031945','2026-ford-f450-platinum-sed11015','SED11015',2026,'Ford','F450','Platinum','Black Platinum sourced, converted and held by SCD Direct','This exact 2026 Ford F450 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','Introducing the 2026 Ford F-450 Super Duty Platinum DRW - a true workhorse built to handle the toughest jobs with uncompromising capability and refined luxury. This exceptional vehicle is now available at our dealership, and we''re excited to showcase its impressive features.- 360 degree Camera- Adaptive Cruise Control- Blind-Spot Monitors- B&O Unleashed Sound System by Bang & Olufsen- Front dual zone A/C- Twin Panel Power MoonroofPowered by the renowned Power Stroke 6.7L V8 DI 32V OHV Turbodiesel engine, this F-450SD delivers unparalleled performance and efficiency. Paired with a 10-Speed Automatic transmission and 4WD, it''s ready to tackle any terrain or towing challenge with ease.

Beyond the impressive mechanical capabilities, this F-450SD is also packed with a wealth of premium features that elevate the driving experience. From the advanced SYNC 4 infotainment system to the luxurious leather-wrapped steering wheel and heated/ventilated front seats, every detail has been meticulously crafted to provide maximum comfort and convenience.

Safety and technology are also top priorities, with features like Blind-Spot Monitoring, Adaptive Cruise Control, and a 360-degree camera system ensuring you can navigate confidently, whether on the job site or the open road.

Conversion by',24900000,'$249,000','Excluding government charges and on-road costs.','in_stock',2750,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','354.5 kW (SCD listing)',NULL,'Automatic','4X4','Black','Black',5,NULL,'1FT8W4DM5SED11015',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',0,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4031945-image-1','scd-4031945','https://cdn.images.stock.i-motor.net.au/vehicles/large/4031945-SED11015-5e2cb2fb-aae0-5d51-ab7a-a02edbdeaedb.jpg','2026 Ford F450 Platinum stock SED11015, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4031945-image-2','scd-4031945','https://cdn.images.stock.i-motor.net.au/vehicles/large/4031945-SED11015-9fad3028-9cb9-539e-b02c-34f31a3b87f3.jpg','2026 Ford F450 Platinum stock SED11015, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4031945-image-3','scd-4031945','https://cdn.images.stock.i-motor.net.au/vehicles/large/4031945-SED11015-179d5c2c-2126-54e5-a2f0-276b8f7ac9ff.jpg','2026 Ford F450 Platinum stock SED11015, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4031945-image-4','scd-4031945','https://cdn.images.stock.i-motor.net.au/vehicles/large/4031945-SED11015-282f1793-0d32-53d1-9b8d-21a153761a58.jpg','2026 Ford F450 Platinum stock SED11015, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031945','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031945','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031945','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031945','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031945','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-360-degree-camera','360-degree camera','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031945','scd-feature-360-degree-camera');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-adaptive-cruise-control','Adaptive cruise control','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031945','scd-feature-adaptive-cruise-control');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-blind-spot-monitoring','Blind-spot monitoring','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031945','scd-feature-blind-spot-monitoring');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-b-o-premium-audio','B&O premium audio','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031945','scd-feature-b-o-premium-audio');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-heated-and-ventilated-front-seats','Heated and ventilated front seats','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031945','scd-feature-heated-and-ventilated-front-seats');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-panoramic-roof','Panoramic roof','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031945','scd-feature-panoramic-roof');
--> statement-breakpoint
INSERT INTO `vehicles` (`id`,`slug`,`stock_number`,`year`,`make`,`model`,`variant`,`headline`,`short_description`,`full_description`,`price_cents`,`price_display`,`price_qualifier`,`availability_status`,`odometer_km`,`body_type`,`fuel_type`,`engine`,`power`,`torque`,`transmission`,`drivetrain`,`exterior_colour`,`interior_colour`,`seating_capacity`,`towing_capacity`,`vin`,`public_vin`,`registration_status`,`compliance_status`,`conversion_provider`,`location`,`featured`,`published`,`published_at`,`is_sample`,`created_at`,`updated_at`,`archived_at`) VALUES ('scd-4031947','2026-ford-f450-platinum-ted76613','TED76613',2026,'Ford','F450','Platinum','Grey Platinum sourced, converted and held by SCD Direct','This exact 2026 Ford F450 is imported, converted and held by SCD Direct and offered for sale by Betts Works.','2026 Ford F-450 Platinum Plus Crew Cab 4X4 Dually, lifted with a 2.5-inch Icon Dual Rate Lift Springs, Fox 2.0 Smooth Body Shocks, and 24-inch American ForceJTX Gloss Black Wheels. Powered by a TurboCharged 6.7L PowerStroke High Ouput Diesel V8, it delivers 500hp and 1200lb-ft of torque. Features include LED lighting, heated/ventilated leather seats, dual-zone climate control, and a B O Unleashed sound system.

Includes RHD Conversion and Compliance',29200000,'$292,000','Excluding government charges and on-road costs.','in_stock',160,'Ute','Diesel','6.7L V8 Power Stroke turbo diesel','354.5 kW (SCD listing)','1,200 lb-ft (SCD listing)','Automatic','4X4','Grey','Black',5,NULL,'1FT8W4DM7TED76613',1,NULL,'RHD conversion and Australian compliance included, per SCD Direct listing.','SCD Direct','Held by SCD Direct, North Eagle Farm, QLD',0,1,'2026-07-24T00:00:00+10:00',0,'2026-07-24T00:00:00+10:00','2026-07-24T00:00:00+10:00',NULL);
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4031947-image-1','scd-4031947','https://cdn.images.stock.i-motor.net.au/vehicles/large/4031947-TED76613-13e599f4-713b-5f87-82bf-c9c3e5d939ea.jpg','2026 Ford F450 Platinum stock TED76613, photo 1 of 4',1600,1067,0,1,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4031947-image-2','scd-4031947','https://cdn.images.stock.i-motor.net.au/vehicles/large/4031947-TED76613-1669f52c-4232-5698-8cd0-2f6646d74547.jpg','2026 Ford F450 Platinum stock TED76613, photo 2 of 4',1600,1067,1,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4031947-image-3','scd-4031947','https://cdn.images.stock.i-motor.net.au/vehicles/large/4031947-TED76613-47f47348-c088-5ee3-bb94-7402dbc07c1e.jpg','2026 Ford F450 Platinum stock TED76613, photo 3 of 4',1600,1067,2,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT INTO `vehicle_images` (`id`,`vehicle_id`,`storage_key`,`alt_text`,`width`,`height`,`display_order`,`is_primary`,`created_at`) VALUES ('scd-4031947-image-4','scd-4031947','https://cdn.images.stock.i-motor.net.au/vehicles/large/4031947-TED76613-5c26a98e-f817-5754-a390-86b2f327209e.jpg','2026 Ford F450 Platinum stock TED76613, photo 4 of 4',1600,1067,3,0,'2026-07-24T00:00:00+10:00');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-6-7l-power-stroke-turbo-diesel','6.7L Power Stroke turbo diesel','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031947','scd-feature-6-7l-power-stroke-turbo-diesel');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-automatic-transmission','Automatic transmission','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031947','scd-feature-automatic-transmission');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-4x4-drivetrain','4x4 drivetrain','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031947','scd-feature-4x4-drivetrain');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-right-hand-drive-conversion-by-scd-direct','Right-hand-drive conversion by SCD Direct','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031947','scd-feature-right-hand-drive-conversion-by-scd-direct');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-australian-compliance-included','Australian compliance included','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031947','scd-feature-australian-compliance-included');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-b-o-premium-audio','B&O premium audio','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031947','scd-feature-b-o-premium-audio');
--> statement-breakpoint
INSERT OR IGNORE INTO `features` (`id`,`name`,`category`) VALUES ('scd-feature-heated-and-ventilated-front-seats','Heated and ventilated front seats','SCD listing');
--> statement-breakpoint
INSERT OR IGNORE INTO `vehicle_features` (`vehicle_id`,`feature_id`) VALUES ('scd-4031947','scd-feature-heated-and-ventilated-front-seats');
--> statement-breakpoint
