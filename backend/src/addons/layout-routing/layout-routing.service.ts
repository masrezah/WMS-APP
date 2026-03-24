import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LayoutRoutingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Validates if the warehouse aisle is wide enough for the requested vehicle type.
   * Logic derived from 'Lebar jalan lintasan Minimum (meter)' constraints.
   */
  async validateAisleWidth(warehouseId: string, vehicleType: string) {
    // In a real application, warehouse layout settings would be fetched from the DB.
    // We mock the typical constraints as defined in the architectural plan.
    const vehicleRequirements = {
      'HandTruck': 1.5,
      'Forklift_1Way': 2.25,
      'Forklift_2Way': 4.5,
      'TractorTrailer': 4.5,
      'MobileCrane': 5.0
    };

    const requirement = vehicleRequirements[vehicleType];
    if (!requirement) {
      throw new BadRequestException('Unknown vehicle type');
    }

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId }
    });

    if (!warehouse) {
      throw new BadRequestException('Warehouse not found');
    }

    // Assume all current generic warehouses in the DB have a default 3.0m aisle unless specified in a specific Layout entity
    const currentAisleWidth = 3.0; 
    
    return {
      warehouseId,
      vehicleType,
      requiredWidth: requirement,
      currentAisleWidth,
      isCompatible: currentAisleWidth >= requirement,
      message: currentAisleWidth >= requirement 
        ? `Aisle width (${currentAisleWidth}m) is sufficient for ${vehicleType}.`
        : `Aisle width (${currentAisleWidth}m) is too narrow for ${vehicleType} (requires ${requirement}m).`
    };
  }

  /**
   * Simple mocked routing logic to sort target locations into a cohesive sequence.
   */
  async calculateOptimalRoute(warehouseId: string, targetLocationIds: string[]) {
    if (targetLocationIds.length === 0) return { route: [] };

    // Fetch locations to get their zones/racks
    const locations = await this.prisma.location.findMany({
      where: {
        id: { in: targetLocationIds },
        warehouse_id: warehouseId
      }
    });

    // Sort locations to simulate a basic "S-Shape" or sequential routing 
    // sorting by Zone, then Rack, then Level, then Bin
    const sortedLocations = locations.sort((a, b) => {
      if (a.zone !== b.zone) return a.zone.localeCompare(b.zone);
      if (a.rack !== b.rack) return a.rack.localeCompare(b.rack);
      if (a.shelf !== b.shelf) return a.shelf.localeCompare(b.shelf);
      return a.bin.localeCompare(b.bin);
    });

    return {
      warehouseId,
      routingAlgorithm: 'S-Shape Sequential',
      route: sortedLocations
    };
  }
}
