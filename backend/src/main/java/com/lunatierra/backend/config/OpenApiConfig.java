package com.lunatierra.backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "LunaTierra API",
                version = "v1",
                description = "APIs para seguimiento de cultivos, recomendaciones agrícolas, clima, fases lunares y progreso diario.",
                contact = @Contact(name = "LunaTierra", email = "soporte@lunatierra.app")
        ),
        servers = {
                @Server(url = "http://localhost:8080", description = "Local"),
                @Server(url = "http://192.168.1.134:8080", description = "Red local")
        },
        security = {
                @SecurityRequirement(name = "bearerAuth")
        }
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER,
        description = "JWT usado por endpoints autenticados. Formato: Bearer {token}"
)
public class OpenApiConfig {

    @Bean
    public OpenAPI lunatierraOpenApi() {
        return new OpenAPI()
                .info(new io.swagger.v3.oas.models.info.Info()
                        .title("LunaTierra API")
                        .version("v1")
                        .description("Documentación OpenAPI 3 para LunaTierra. Lista, prueba y escala endpoints agrícolas y de acompañamiento diario.")
                        .license(new License().name("Proprietary")));
    }
}
