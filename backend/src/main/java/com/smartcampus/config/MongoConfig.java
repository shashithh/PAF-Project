package com.smartcampus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Registers converters so LocalDate and LocalTime are stored as
 * ISO strings ("2026-04-20", "09:00") in MongoDB documents.
 */
@Configuration
public class MongoConfig {

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(List.of(
            new LocalDateToStringConverter(),
            new StringToLocalDateConverter(),
            new LocalTimeToStringConverter(),
            new StringToLocalTimeConverter()
        ));
    }

    // ── LocalDate ─────────────────────────────────────────────

    @WritingConverter
    static class LocalDateToStringConverter implements Converter<LocalDate, String> {
        @Override public String convert(LocalDate source) { return source.toString(); }
    }

    @ReadingConverter
    static class StringToLocalDateConverter implements Converter<String, LocalDate> {
        @Override public LocalDate convert(String source) { return LocalDate.parse(source); }
    }

    // ── LocalTime ─────────────────────────────────────────────

    @WritingConverter
    static class LocalTimeToStringConverter implements Converter<LocalTime, String> {
        @Override public String convert(LocalTime source) { return source.toString(); }
    }

    @ReadingConverter
    static class StringToLocalTimeConverter implements Converter<String, LocalTime> {
        @Override public LocalTime convert(String source) { return LocalTime.parse(source); }
    }
}
