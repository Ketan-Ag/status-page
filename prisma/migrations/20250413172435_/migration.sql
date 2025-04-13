-- RenameIndex
ALTER TABLE `_incidenttoservice` RENAME INDEX `_IncidentToService_AB_unique` TO `_incidenttoservice_AB_unique`;

-- RenameIndex
ALTER TABLE `_incidenttoservice` RENAME INDEX `_IncidentToService_B_index` TO `_incidenttoservice_B_index`;

-- RenameIndex
ALTER TABLE `_maintenancetoservice` RENAME INDEX `_MaintenanceToService_AB_unique` TO `_maintenancetoservice_AB_unique`;

-- RenameIndex
ALTER TABLE `_maintenancetoservice` RENAME INDEX `_MaintenanceToService_B_index` TO `_maintenancetoservice_B_index`;
