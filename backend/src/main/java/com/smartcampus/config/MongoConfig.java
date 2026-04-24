package com.smartcampus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;

/**
 * MongoDB converters — stores LocalDate and LocalTime as ISO strings.
 *
 * The @ReadingConverter for String→LocalDate/LocalTime is intentionally
 * wrapped in try/catch so non-date strings (name, location, purpose…)
 * are silently ignored and Spring falls back to its default handling.
 */
@Configuration
@EnableMongoAuditing
public class MongoConfig {

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(List.of(
            new LocalDateWriter(),
            new LocalDateReader(),
            new LocalTimeWriter(),
            new LocalTimeReader()
        ));
    }

    @WritingConverter
    static class LocalDateWriter implements Converter<LocalDate, String> {
        @Override public String convert(LocalDate s) { return s.toString(); }
    }

    @ReadingConverter
    static class LocalDateReader implements Converter<String, LocalDate> {
        @Override public LocalDate convert(String s) {
            // Only parse strings that look like a date: YYYY-MM-DD (10 chars, contains dashes)
            if (s == null || s.length() != 10 || s.charAt(4) != '-') return null;
            try { return LocalDate.parse(s); } catch (DateTimeParseException e) { return null; }
        }
    }

    @WritingConverter
    static class LocalTimeWriter implements Converter<LocalTime, String> {
        @Override public String convert(LocalTime s) { return s.toString(); }
    }

    @ReadingConverter
    static class LocalTimeReader implements Converter<String, LocalTime> {
        @Override public LocalTime convert(String s) {
            // Only parse strings that look like a time: HH:MM or HH:MM:SS (5-8 chars, colon at pos 2)
            if (s == null || s.length() < 5 || s.length() > 8 || s.charAt(2) != ':') return null;
            try { return LocalTime.parse(s); } catch (DateTimeParseException e) { return null; }
        }
    }
}
