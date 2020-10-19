<?php

namespace App\Entity;

use App\Repository\CompteRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=CompteRepository::class)
 *
 */
class Compte
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
     * @ORM\Column(type="float", nullable=true)
     */
    private $soldedisponible;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     *
     */
    private $created;


    /**
     * @ORM\Column(type="datetime", nullable=true, nullable=true)
     */
    private $duregele;

    /**
     * @ORM\Column(type="float")
     */
    private $montantgele;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $tauxgele;

    /**
     * @ORM\Column(type="boolean")
     */
    private $estValide;

    /**
     * @ORM\Column(type="boolean")
     */
    private $estretirable;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $portefeuille;

    /**
     * @ORM\OneToOne(targetEntity=User::class, inversedBy="refCompte", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $refUser;


    /**
     * @ORM\Column(type="boolean")
     */
    private $estSupprimer;

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

    public function getSoldedisponible(): ?float
    {
        return $this->soldedisponible;
    }

    public function setSoldedisponible(?float $soldedisponible): self
    {
        $this->soldedisponible = $soldedisponible;

        return $this;
    }

    public function getDuregele(): ?\DateTimeInterface
    {
        return $this->duregele;
    }

    public function setDuregele(?\DateTimeInterface $duregele): self
    {
        $this->duregele = $duregele;

        return $this;
    }

    public function getMontantgele(): ?float
    {
        return $this->montantgele;
    }

    public function setMontantgele(float $montantgele): self
    {
        $this->montantgele = $montantgele;

        return $this;
    }

    public function getTauxgele(): ?int
    {
        return $this->tauxgele;
    }

    public function setTauxgele(?int $tauxgele): self
    {
        $this->tauxgele = $tauxgele;

        return $this;
    }

    public function getEstValide(): ?bool
    {
        return $this->estValide;
    }

    public function setEstValide(bool $estValide): self
    {
        $this->estValide = $estValide;

        return $this;
    }

    public function getEstretirable(): ?bool
    {
        return $this->estretirable;
    }

    public function setEstretirable(bool $estretirable): self
    {
        $this->estretirable = $estretirable;

        return $this;
    }

    public function getPortefeuille(): ?string
    {
        return $this->portefeuille;
    }

    public function setPortefeuille(string $portefeuille): self
    {
        $this->portefeuille = $portefeuille;

        return $this;
    }

    public function getRefUser(): ?User
    {
        return $this->refUser;
    }

    public function setRefUser(User $refUser): self
    {
        $this->refUser = $refUser;

        return $this;
    }

    public function __toString(): ?string
    {
        return $this->getLibelle();
    }

    public function getCreated(): ?\DateTimeInterface
    {
        return $this->created;
    }

    public function setCreated(\DateTimeInterface $created): self
    {
        $this->created = $created;

        return $this;
    }
}
