-- ============================
-- Table: course
-- ============================
CREATE TABLE course
(
    id                       VARCHAR(255) PRIMARY KEY,
    title                    VARCHAR(255) NOT NULL,
    created                  DATETIME     NOT NULL,
    updated                  DATETIME     NOT NULL,
    version                  INT          NOT NULL,
    activity_id              VARCHAR(255) NOT NULL,
    course_learning_standard VARCHAR(255) NOT NULL,
    description              TEXT
);

-- ============================
-- Table: learner (Moved Up)
-- ============================
CREATE TABLE learner
(
    id         VARCHAR(255) PRIMARY KEY,
    email      VARCHAR(255),
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL
);

-- ============================
-- Table: registration
-- ============================
CREATE TABLE registration
(
    id         VARCHAR(255) PRIMARY KEY,
    instance   INT          NOT NULL,
    updated    DATETIME     NOT NULL,
    course_id  VARCHAR(255) NOT NULL,
    learner_id VARCHAR(255) NOT NULL,

    FOREIGN KEY (course_id) REFERENCES course (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (learner_id) REFERENCES learner (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================
-- Table: activity
-- ============================
CREATE TABLE activity
(
    id                   VARCHAR(255) PRIMARY KEY,
    resource_identifier  VARCHAR(255)                                                 NOT NULL,
    activity_type        ENUM ('UNKNOWN', 'AGGREGATION', 'SCO', 'ASSET', 'OBJECTIVE') NOT NULL,
    href                 VARCHAR(255)                                                 NOT NULL,
    scaled_passing_score VARCHAR(255),
    title                VARCHAR(255)                                                 NOT NULL,
    parent_id            VARCHAR(255),

    FOREIGN KEY (parent_id) REFERENCES activity (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================
-- Table: registration_activity
-- ============================
CREATE TABLE registration_activity
(
    id                               INT PRIMARY KEY AUTO_INCREMENT,
    registration_id                  VARCHAR(255)                                NOT NULL,
    activity_id                      VARCHAR(255)                                NOT NULL,

    attempts                         INT                                         NOT NULL,
    activity_completion              ENUM ('UNKNOWN', 'COMPLETED', 'INCOMPLETE') NOT NULL,
    activity_success                 ENUM ('UNKNOWN', 'PASSED', 'FAILED')        NOT NULL,
    score_scaled                     FLOAT                                       NOT NULL DEFAULT 0, -- Extracted from `score` object
    time_tracked                     VARCHAR(255)                                NOT NULL,
    completion_amount_scaled         FLOAT                                       NOT NULL,           -- Extracted from `completionAmount` object
    suspended                        BOOLEAN                                     NOT NULL,

    static_completion_threshold      VARCHAR(255)                                NOT NULL,
    static_launch_data               TEXT                                        NOT NULL,
    static_max_time_allowed          VARCHAR(255)                                NOT NULL,
    static_scaled_passing_score      FLOAT                                       NOT NULL,
    static_scaled_passing_score_used BOOLEAN                                     NOT NULL,
    static_time_limit_action         VARCHAR(255)                                NOT NULL,

    FOREIGN KEY (registration_id) REFERENCES registration (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activity (id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_key (registration_id, activity_id)
);


-- ============================
-- Table: runtime
-- ============================
CREATE TABLE runtime
(
    id                                  INT PRIMARY KEY AUTO_INCREMENT,
    registration_activity_id            INT                                  NOT NULL UNIQUE,
    completion_status                   VARCHAR(255)                         NOT NULL,
    credit                              VARCHAR(255)                         NOT NULL,
    entry                               VARCHAR(255)                         NOT NULL,
    exit_val                            VARCHAR(255)                         NOT NULL,
    learner_preference_audio_lvl        FLOAT                                NOT NULL,
    learner_preference_lang             VARCHAR(255)                         NOT NULL,
    learner_preference_delivery_speed   FLOAT                                NOT NULL,
    learner_preference_audio_captioning FLOAT                                NOT NULL,
    location                            VARCHAR(255),
    mode                                VARCHAR(255)                         NOT NULL,
    progress_measure                    VARCHAR(255)                         NOT NULL,
    score_scaled                        VARCHAR(255)                         NOT NULL,
    score_raw                           VARCHAR(255)                         NOT NULL,
    score_min                           VARCHAR(255)                         NOT NULL,
    score_max                           VARCHAR(255)                         NOT NULL,
    total_time                          VARCHAR(255)                         NOT NULL,
    time_tracked                        VARCHAR(255)                         NOT NULL,
    runtime_success_status              ENUM ('UNKNOWN', 'PASSED', 'FAILED') NOT NULL,

    FOREIGN KEY (registration_activity_id) REFERENCES registration_activity (id) ON DELETE CASCADE ON UPDATE CASCADE

);

CREATE TABLE runtime_interaction
(
    id                VARCHAR(255) PRIMARY KEY,
    runtime_id        INT          NOT NULL,
    type              ENUM (
        'TrueFalse',
        'Choice',
        'FillIn',
        'LongFillIn',
        'Matching',
        'Performance',
        'Sequencing',
        'Likert',
        'Numeric',
        'Other'
        )                          NOT NULL,
    objectives        TEXT         NOT NULL,
    timestamp         DATETIME     NULL,
    timestamp_utc     DATETIME     NULL,
    correct_responses TEXT         NOT NULL,
    weighting         VARCHAR(255) NOT NULL,
    learner_response  VARCHAR(255) NOT NULL,
    result            VARCHAR(255) NOT NULL,
    latency           VARCHAR(255) NOT NULL,
    description       TEXT         NULL,

    FOREIGN KEY (runtime_id) REFERENCES runtime (id) ON DELETE CASCADE ON UPDATE CASCADE
);
