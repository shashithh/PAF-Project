package com.smartcampus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Custom MongoDB write converters for LocalDate and LocalTime.
 *
 * We only register @WritingConverter (Java → MongoDB).
 * NO @ReadingConverter is registered because a global String→LocalDate/LocalTime
 * converter intercepts ALL string fields in every document, causing crashes
 * when non-date strings (purpose, name, location, etc.) are read.
 *
 * Spring Data MongoDB 4.x reads LocalDate and LocalTime from ISO strings
 * natively without needing a custom read converter.
 */
@Configuration
public class MongoConfig {

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(List.of(
            new LocalDateWriteConverter(),
            new LocalTimeWriteConverter()
        ));
    }

    @WritingConverter
    static class LocalDateWriteConverter implements Converter<LocalDate, String> {
        @Override
        public String convert(LocalDate source) {
            return source.toString(); // "2026-04-20"
        }
    }

    @WritingConverter
    static class LocalTimeWriteConverter implements Converter<LocalTime, String> {
        @Override
        public String convert(LocalTime source) {
            return source.toString(); // "09:00"
        }
    }
}
