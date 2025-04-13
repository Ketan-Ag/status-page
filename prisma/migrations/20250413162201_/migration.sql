-- CreateTable
CREATE TABLE `Organization` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Organization_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Team` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    `organizationId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` ENUM('OPERATIONAL', 'DEGRADED_PERFORMANCE', 'PARTIAL_OUTAGE', 'MAJOR_OUTAGE') NOT NULL DEFAULT 'OPERATIONAL',
    `organizationId` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Incident` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('INVESTIGATING', 'IDENTIFIED', 'MONITORING', 'RESOLVED') NOT NULL DEFAULT 'INVESTIGATING',
    `impact` ENUM('NONE', 'MINOR', 'MAJOR', 'CRITICAL') NOT NULL DEFAULT 'NONE',
    `organizationId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IncidentUpdate` (
    `id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `status` ENUM('INVESTIGATING', 'IDENTIFIED', 'MONITORING', 'RESOLVED') NOT NULL,
    `incidentId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamMember` (
    `id` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TeamMember_teamId_userId_key`(`teamId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Maintenance` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `status` ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `organizationId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_IncidentToService` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_IncidentToService_AB_unique`(`A`, `B`),
    INDEX `_IncidentToService_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MaintenanceToService` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_MaintenanceToService_AB_unique`(`A`, `B`),
    INDEX `_MaintenanceToService_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Incident` ADD CONSTRAINT `Incident_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncidentUpdate` ADD CONSTRAINT `IncidentUpdate_incidentId_fkey` FOREIGN KEY (`incidentId`) REFERENCES `Incident`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamMember` ADD CONSTRAINT `TeamMember_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamMember` ADD CONSTRAINT `TeamMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_IncidentToService` ADD CONSTRAINT `_IncidentToService_A_fkey` FOREIGN KEY (`A`) REFERENCES `Incident`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_IncidentToService` ADD CONSTRAINT `_IncidentToService_B_fkey` FOREIGN KEY (`B`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MaintenanceToService` ADD CONSTRAINT `_MaintenanceToService_A_fkey` FOREIGN KEY (`A`) REFERENCES `Maintenance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MaintenanceToService` ADD CONSTRAINT `_MaintenanceToService_B_fkey` FOREIGN KEY (`B`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
