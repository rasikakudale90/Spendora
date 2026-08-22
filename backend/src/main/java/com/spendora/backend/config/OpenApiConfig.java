package com.spendora.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI spendoraOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Spendora REST API")
                        .description("Backend REST APIs for Spendora Personal Finance Management Platform (V1–V3)")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Spendora Development Team")
                                .email("contact@spendora.com")));
    }
}
