import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './user-role.entity';
import { Permission } from './entities/permission.entity';
import { UserRolePermission } from './entities/user-role-permission.entity';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(UserRolePermission)
    private userRolePermissionRepository: Repository<UserRolePermission>,
  ) {
    // Seed permissions on service initialization
    this.seedPermissions().catch(error => console.error('Seeding failed:', error));
  }

  // Seed initial permissions
  private async seedPermissions() {
    try {
      const count = await this.permissionRepository.count();
      if (count === 0) {
        const initialPermissions = [
          {
            permissionName: 'User Management',
            isMaster: true,
            isReadDisplay: true,
            isCreateDisplay: true,
            isUpdateDisplay: true,
            isDeleteDisplay: true,
            isExecuteDisplay: true,
          },
          
        ];
        await this.permissionRepository.save(initialPermissions);
        console.log('Permissions seeded successfully');
      }
    } catch (error) {
      console.error('Error seeding permissions:', error);
    }
  }

  async create(createUserRoleDto: CreateUserRoleDto) {
    try {
      // Validate permission IDs
      const permissionIds = createUserRoleDto.permissions.map(p => p.id);
      const existingPermissions = await this.permissionRepository.findByIds(permissionIds);
      if (existingPermissions.length !== permissionIds.length) {
        throw new BadRequestException('One or more permission IDs are invalid');
      }

      const userRole = this.userRoleRepository.create({
        userRoleName: createUserRoleDto.UserRoleName,
        active: true,
      });
      
      const savedUserRole = await this.userRoleRepository.save(userRole);
      
      const permissions = createUserRoleDto.permissions.map(perm => ({
        userRoleId: savedUserRole.id,
        permissionId: perm.id,
        isRead: perm.IsRead || false,
        isCreate: perm.IsCreate || false,
        isUpdate: perm.IsUpdate || false,
        isDelete: perm.IsDelete || false,
        isExecute: perm.IsExecute || false,
      }));
      
      await this.userRolePermissionRepository.save(permissions);
      return await this.findOne(savedUserRole.id);
    } catch (error) {
      throw new BadRequestException(`Failed to create user role: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.userRoleRepository.find({
        relations: ['permissions', 'permissions.permission'],
      });
    } catch (error) {
      throw new BadRequestException(`Failed to fetch user roles: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const userRole = await this.userRoleRepository.findOne({
        where: { id },
        relations: ['permissions', 'permissions.permission'],
      });
      if (!userRole) {
        throw new NotFoundException(`User role with ID ${id} not found`);
      }
      return userRole;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch user role: ${error.message}`);
    }
  }

  async update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    try {
      // Check if user role exists
      const existingRole = await this.findOne(id);
      
      // Validate permission IDs
      const permissionIds = updateUserRoleDto.permissions.map(p => p.id);
      const existingPermissions = await this.permissionRepository.findByIds(permissionIds);
      if (existingPermissions.length !== permissionIds.length) {
        throw new BadRequestException('One or more permission IDs are invalid');
      }

      await this.userRoleRepository.update(id, {
        userRoleName: updateUserRoleDto.UserRoleName,
        active: updateUserRoleDto.Active,
      });

      await this.userRolePermissionRepository.delete({ userRoleId: id });
      const permissions = updateUserRoleDto.permissions.map(perm => ({
        userRoleId: id,
        permissionId: perm.id,
        isRead: perm.IsRead || false,
        isCreate: perm.IsCreate || false,
        isUpdate: perm.IsUpdate || false,
        isDelete: perm.IsDelete || false,
        isExecute: perm.IsExecute || false,
      }));
      
      await this.userRolePermissionRepository.save(permissions);
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException(`Failed to update user role: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const existingRole = await this.findOne(id);
      await this.userRolePermissionRepository.delete({ userRoleId: id });
      await this.userRoleRepository.delete(id);
      return { message: 'User role deleted successfully' };
    } catch (error) {
      throw new BadRequestException(`Failed to delete user role: ${error.message}`);
    }
  }

  async getAllPermissions() {
    try {
      return await this.permissionRepository.find();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch permissions: ${error.message}`);
    }
  }
}