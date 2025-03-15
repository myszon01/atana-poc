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
-- Table: runtime
-- ============================
CREATE TABLE runtime
(
    id                                  VARCHAR(255) PRIMARY KEY,
    completion_status                   VARCHAR(255) NOT NULL,
    credit                              VARCHAR(255) NOT NULL,
    entry                               VARCHAR(255) NOT NULL,
    `exit`                              VARCHAR(255) NOT NULL,
    learner_preference_audio_lvl        FLOAT        NOT NULL,
    learner_preference_lang             VARCHAR(255) NOT NULL,
    learner_preference_delivery_speed   FLOAT        NOT NULL,
    learner_preference_audio_captioning FLOAT        NOT NULL,
    location                            VARCHAR(255) NOT NULL,
    mode                                VARCHAR(255) NOT NULL,
    progress_measure                    VARCHAR(255) NOT NULL,
    score_scaled                        VARCHAR(255) NOT NULL,
    score_raw                           VARCHAR(255) NOT NULL,
    score_min                           VARCHAR(255) NOT NULL,
    score_max                           VARCHAR(255) NOT NULL,
    total_time                          VARCHAR(255) NOT NULL,
    time_tracked                        VARCHAR(255) NOT NULL,
    runtime_success_status              ENUM('UNKNOWN', 'PASSED', 'FAILED') NOT NULL
);

-- ============================
-- Table: learner (Moved Up)
-- ============================
CREATE TABLE learner
(
    id        VARCHAR(255) PRIMARY KEY,
    email     VARCHAR(255),
    firstName VARCHAR(255) NOT NULL,
    lastName  VARCHAR(255) NOT NULL
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

    FOREIGN KEY (course_id) REFERENCES course (id),
    FOREIGN KEY (learner_id) REFERENCES learner (id) -- Learner table must exist first
);

-- ============================
-- Table: activity
-- ============================
CREATE TABLE activity
(
    id                   VARCHAR(255) PRIMARY KEY,
    resource_identifier  VARCHAR(255) NOT NULL,
    activity_type        ENUM('UNKNOWN', 'AGGREGATION', 'SCO', 'ASSET', 'OBJECTIVE') NOT NULL,
    href                 VARCHAR(255) NOT NULL,
    scaled_passing_score VARCHAR(255),
    title                VARCHAR(255) NOT NULL,
    parent_id            VARCHAR(255),

    FOREIGN KEY (parent_id) REFERENCES activity (id)
);

-- ============================
-- Table: registration_activity
-- ============================
CREATE TABLE registration_activity
(
    id                               VARCHAR(255) PRIMARY KEY,
    registration_id                  VARCHAR(255) NOT NULL,
    activity_id                      VARCHAR(255) NOT NULL,
    runtime_id                       VARCHAR(255) NOT NULL,
    parent_id                        VARCHAR(255),

    attempts                         INT          NOT NULL,
    activityCompletion               ENUM('UNKNOWN', 'COMPLETED', 'INCOMPLETE') NOT NULL,
    activitySuccess                  ENUM('UNKNOWN', 'PASSED', 'FAILED') NOT NULL,
    score_scaled                     FLOAT        NOT NULL DEFAULT 0, -- Extracted from `score` object
    timeTracked                      VARCHAR(255) NOT NULL,
    completionAmount_scaled          FLOAT        NOT NULL,           -- Extracted from `completionAmount` object
    suspended                        BOOLEAN      NOT NULL,

    static_completion_threshold      VARCHAR(255) NOT NULL,
    static_launch_data               TEXT         NOT NULL,
    static_max_time_allowed          VARCHAR(255) NOT NULL,
    static_scaled_passing_score      FLOAT        NOT NULL,
    static_scaled_passing_score_used BOOLEAN      NOT NULL,
    static_time_limit_action         VARCHAR(255) NOT NULL,

    FOREIGN KEY (registration_id) REFERENCES registration (id),
    FOREIGN KEY (activity_id) REFERENCES activity (id),
    FOREIGN KEY (runtime_id) REFERENCES runtime (id),
    FOREIGN KEY (parent_id) REFERENCES registration_activity (id)
);