package de.tum.in.www1.artemis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.tum.in.www1.artemis.domain.OnlineCourseConfiguration;

/**
 * Spring Data JPA repository for the OnlineCourseConfiguration entity.
 */
@Repository
public interface OnlineCourseConfigurationRepository extends JpaRepository<OnlineCourseConfiguration, Long> {
    // This interface is intentionally left blank. Spring Data JPA generates the implementation at runtime.
}
