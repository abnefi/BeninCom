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

    /**
     * @ORM\Column(name="supprimmer", type="boolean")
     */
    private $estSupprimer;

    /**
     *
     * @ORM\Column(name="created", type="datetime",nullable=true)
     */

    private $created;


    /**
     * @var string
     * @ORM\Column(name="createdBy", type="string", length=255, nullable=true)
     */
    private $createdBy;

    /**
     *
     * @ORM\Column(name="updateAt", type="datetime",nullable=true)
     */

    private $updateAt;

    /**
     * @var string
     * @ORM\Column(name="updateBy", type="string", length=255, nullable=true)
     */
    private $updateBy;




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

    public function getEstSupprimer(): ?bool
    {
        return $this->estSupprimer;
    }

    public function setEstSupprimer(bool $estSupprimer): self
    {
        $this->estSupprimer = $estSupprimer;

        return $this;
    }

    public function getCreated(): ?\DateTimeInterface
    {
        return $this->created;
    }

    public function setCreated(?\DateTimeInterface $created): self
    {
        $this->created = $created;

        return $this;
    }

    public function getCreatedBy(): ?string
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?string $createdBy): self
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function getUpdateAt(): ?\DateTimeInterface
    {
        return $this->updateAt;
    }

    public function setUpdateAt(?\DateTimeInterface $updateAt): self
    {
        $this->updateAt = $updateAt;

        return $this;
    }

    public function getUpdateBy(): ?string
    {
        return $this->updateBy;
    }

    public function setUpdateBy(?string $updateBy): self
    {
        $this->updateBy = $updateBy;

        return $this;
    }

}
