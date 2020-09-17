<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200916104509 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE article (id INT AUTO_INCREMENT NOT NULL, ref_produit_id INT NOT NULL, ref_user_id INT NOT NULL, libelle VARCHAR(255) NOT NULL, lienarticle VARCHAR(255) NOT NULL, texte VARCHAR(255) NOT NULL, estcliker TINYINT(1) NOT NULL, time TIME NOT NULL, created DATETIME NOT NULL, INDEX IDX_23A0E669F191E5 (ref_produit_id), INDEX IDX_23A0E66637A8045 (ref_user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE compte (id INT AUTO_INCREMENT NOT NULL, ref_user_id INT NOT NULL, libelle VARCHAR(255) NOT NULL, soldedisponible DOUBLE PRECISION DEFAULT NULL, created DATETIME NOT NULL, duregele DATETIME DEFAULT NULL, montantgele DOUBLE PRECISION NOT NULL, tauxgele INT DEFAULT NULL, est_valide TINYINT(1) NOT NULL, estretirable TINYINT(1) NOT NULL, portefeuille VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_CFF65260637A8045 (ref_user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE config_type_user (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(255) NOT NULL, texte_acueil VARCHAR(255) DEFAULT NULL, texte_bienvenu VARCHAR(255) DEFAULT NULL, texte_bonus VARCHAR(255) DEFAULT NULL, texte_referal VARCHAR(255) DEFAULT NULL, texte_pub VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE details_produit (id INT AUTO_INCREMENT NOT NULL, ref_produit_id INT NOT NULL, libelle VARCHAR(255) NOT NULL, quantite INT NOT NULL, provenance VARCHAR(255) NOT NULL, montant DOUBLE PRECISION NOT NULL, qtetoucher INT NOT NULL, est_actif TINYINT(1) DEFAULT NULL, aimer TINYINT(1) DEFAULT NULL, observation VARCHAR(255) NOT NULL, datecreation DATETIME NOT NULL, UNIQUE INDEX UNIQ_CFF695369F191E5 (ref_produit_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE paiement (id INT AUTO_INCREMENT NOT NULL, ref_user_id INT NOT NULL, libelle VARCHAR(255) NOT NULL, datepaiement DATETIME NOT NULL, montant DOUBLE PRECISION NOT NULL, motif VARCHAR(255) DEFAULT NULL, mode VARCHAR(255) DEFAULT NULL, est_aprouver TINYINT(1) DEFAULT NULL, INDEX IDX_B1DC7A1E637A8045 (ref_user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE produit (id INT AUTO_INCREMENT NOT NULL, titre VARCHAR(255) NOT NULL, libelle VARCHAR(255) NOT NULL, lien VARCHAR(255) NOT NULL, created DATETIME NOT NULL, image VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reset_password_request (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, selector VARCHAR(20) NOT NULL, hashed_token VARCHAR(100) NOT NULL, requested_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', expires_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_7CE748AA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE type_user (id INT AUTO_INCREMENT NOT NULL, ref_config_type_user_id INT NOT NULL, libelle VARCHAR(255) NOT NULL, totaluser INT DEFAULT NULL, observations VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_5A9C13412AC5E008 (ref_config_type_user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, ref_typeuser_id INT DEFAULT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, firsname VARCHAR(255) NOT NULL, lasname VARCHAR(255) NOT NULL, accorder TINYINT(1) NOT NULL, is_verified TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), UNIQUE INDEX UNIQ_8D93D649F85E0677 (username), INDEX IDX_8D93D6498783A7A2 (ref_typeuser_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_config (id INT AUTO_INCREMENT NOT NULL, ref_user_id INT NOT NULL, libelle VARCHAR(255) DEFAULT NULL, devise VARCHAR(255) DEFAULT NULL, fiscalite VARCHAR(255) DEFAULT NULL, suprimer TINYINT(1) NOT NULL, est_suspecter TINYINT(1) DEFAULT NULL, created DATETIME NOT NULL, pays VARCHAR(255) NOT NULL, ville VARCHAR(255) NOT NULL, sexe VARCHAR(255) NOT NULL, age INT NOT NULL, travail VARCHAR(255) NOT NULL, niveauscolaire VARCHAR(255) NOT NULL, telephone VARCHAR(255) NOT NULL, piece VARCHAR(255) NOT NULL, is_valide TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_B1D83441637A8045 (ref_user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E669F191E5 FOREIGN KEY (ref_produit_id) REFERENCES produit (id)');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E66637A8045 FOREIGN KEY (ref_user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE compte ADD CONSTRAINT FK_CFF65260637A8045 FOREIGN KEY (ref_user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE details_produit ADD CONSTRAINT FK_CFF695369F191E5 FOREIGN KEY (ref_produit_id) REFERENCES produit (id)');
        $this->addSql('ALTER TABLE paiement ADD CONSTRAINT FK_B1DC7A1E637A8045 FOREIGN KEY (ref_user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE reset_password_request ADD CONSTRAINT FK_7CE748AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE type_user ADD CONSTRAINT FK_5A9C13412AC5E008 FOREIGN KEY (ref_config_type_user_id) REFERENCES config_type_user (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6498783A7A2 FOREIGN KEY (ref_typeuser_id) REFERENCES type_user (id)');
        $this->addSql('ALTER TABLE user_config ADD CONSTRAINT FK_B1D83441637A8045 FOREIGN KEY (ref_user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE type_user DROP FOREIGN KEY FK_5A9C13412AC5E008');
        $this->addSql('ALTER TABLE article DROP FOREIGN KEY FK_23A0E669F191E5');
        $this->addSql('ALTER TABLE details_produit DROP FOREIGN KEY FK_CFF695369F191E5');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D6498783A7A2');
        $this->addSql('ALTER TABLE article DROP FOREIGN KEY FK_23A0E66637A8045');
        $this->addSql('ALTER TABLE compte DROP FOREIGN KEY FK_CFF65260637A8045');
        $this->addSql('ALTER TABLE paiement DROP FOREIGN KEY FK_B1DC7A1E637A8045');
        $this->addSql('ALTER TABLE reset_password_request DROP FOREIGN KEY FK_7CE748AA76ED395');
        $this->addSql('ALTER TABLE user_config DROP FOREIGN KEY FK_B1D83441637A8045');
        $this->addSql('DROP TABLE article');
        $this->addSql('DROP TABLE compte');
        $this->addSql('DROP TABLE config_type_user');
        $this->addSql('DROP TABLE details_produit');
        $this->addSql('DROP TABLE paiement');
        $this->addSql('DROP TABLE produit');
        $this->addSql('DROP TABLE reset_password_request');
        $this->addSql('DROP TABLE type_user');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_config');
    }
}
