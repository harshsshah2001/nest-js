import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { VisitorService } from "./visitor.service";
import { Visitor } from "./visitor.entity";

@Controller('visitors')
export class VisitorController {
    constructor(private visitorService: VisitorService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async create(@Body() visitor: Visitor) {
        return this.visitorService.create(visitor);
    }
}
