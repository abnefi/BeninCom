<?php

namespace App\Entity;

use App\Repository\ConfigTypeUserRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * 
 * @ORM\Entity(repositoryClass=ConfigTypeUserRepository::class)
 */
class ConfigTypeUser
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $libelle;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $texteAcueil;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $texteBienvenu;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $texteBonus;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $texteReferal;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $textePub;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(string $libelle): self
    {
        $this->libelle = $libelle;

        return $this;
    }

    public function getTexteAcueil(): ?string
    {
        return $this->texteAcueil;
    }

    public function setTexteAcueil(?string $texteAcueil): self
    {
        $this->texteAcueil = $texteAcueil;

        return $this;
    }

    public function getTexteBienvenu(): ?string
    {
        return $this->texteBienvenu;
    }

    public function setTexteBienvenu(?string $texteBienvenu): self
    {
        $this->texteBienvenu = $texteBienvenu;

        return $this;
    }

    public function getTexteBonus(): ?string
    {
        return $this->texteBonus;
    }

    public function setTexteBonus(?string $texteBonus): self
    {
        $this->texteBonus = $texteBonus;

        return $this;
    }

    public function getTexteReferal(): ?string
    {
        return $this->texteReferal;
    }

    public function setTexteReferal(?string $texteReferal): self
    {
        $this->texteReferal = $texteReferal;

        return $this;
    }

    public function getTextePub(): ?string
    {
        return $this->textePub;
    }

    public function setTextePub(?string $textePub): self
    {
        $this->textePub = $textePub;

        return $this;
    }

    public function __toString(): ?string
    {
        return $this->getLibelle();
    }

}
