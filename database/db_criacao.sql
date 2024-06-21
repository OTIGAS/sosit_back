UPDATE sosit.schedule SET deleted_at = NULL WHERE id_schedule = 1;

CREATE DATABASE sosit;

CREATE TABLE sosit.credential (
    id_credential INT AUTO_INCREMENT,
    PRIMARY KEY (id_credential),
    
    profile ENUM('user', 'company') NOT NULL,
    email_login VARCHAR(100) UNIQUE,
    password_login VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE sosit.user (
    id_user INT AUTO_INCREMENT,
    PRIMARY KEY (id_user),
    
    id_credential INT NOT NULL,
    FOREIGN KEY (id_credential) REFERENCES sosit.credential(id_credential),
    
    name_user VARCHAR(50),
    cpf_user VARCHAR(14) UNIQUE,
    date_of_birth DATE,
    image_user VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE sosit.company (
    id_company INT AUTO_INCREMENT,
    PRIMARY KEY (id_company),
    
    id_credential INT NOT NULL,
    FOREIGN KEY (id_credential) REFERENCES sosit.credential(id_credential),
    
    name_company VARCHAR(50),
    cnpj_company VARCHAR(18) UNIQUE,
    more_information VARCHAR(255),
    image_company VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE sosit.contact (
    id_contact INT AUTO_INCREMENT,
    PRIMARY KEY (id_contact),
    
    id_credential INT NOT NULL,
    FOREIGN KEY (id_credential) REFERENCES sosit.credential(id_credential),
    
    person_name VARCHAR(50),
    email_contact VARCHAR(100),
    phone_contact VARCHAR(15),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE sosit.address (
    id_address INT AUTO_INCREMENT,
    PRIMARY KEY (id_address),
    
    id_credential INT NOT NULL,
    FOREIGN KEY (id_credential) REFERENCES sosit.credential(id_credential),
    
    number VARCHAR(10),
    street VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(10),
    complement VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE sosit.schedule (
	id_schedule INT AUTO_INCREMENT,
    PRIMARY KEY (id_schedule),
    
	id_company INT NOT NULL,
    FOREIGN KEY (id_company) REFERENCES company(id_company),
    
    name_schedule VARCHAR(50),
    service_schedule VARCHAR(50),
    description_schedule VARCHAR(255),
    
    is_active TINYINT NOT NULL DEFAULT 0,
    
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE sosit.times (
	id_times INT AUTO_INCREMENT,
    PRIMARY KEY (id_times),
    
	id_schedule INT NOT NULL,
    FOREIGN KEY (id_schedule) REFERENCES schedule(id_schedule),
    
    status TINYINT NOT NULL DEFAULT 0,
    start_time TIME,
    end_time TIME,
    day_week INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE sosit.commitment (
	id_commitment INT AUTO_INCREMENT,
    PRIMARY KEY (id_commitment),
    
	id_user INT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES user(id_user),
    
	id_times INT NOT NULL,
    FOREIGN KEY (id_times) REFERENCES times(id_times),
    
	date_commitment DATE NOT NULL,
    description_commitment VARCHAR(255),
    
    rating INT DEFAULT 0,
    comment VARCHAR(100),
    
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);