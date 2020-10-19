<?php

namespace App\Entity;

use App\Repository\UserConfigRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=UserConfigRepository::class)
 *
 *
 */
class UserConfig
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $libelle;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $devise;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $fiscalite;

    /**
     * @ORM\Column(type="boolean")
     */
    private $suprimer;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $estSuspecter;


    /**
     * @ORM\Column(type="datetime", nullable=true)
     *
     */
    private $created;

    /**
     * @ORM\OneToOne(targetEntity=User::class, inversedBy="refUserconfig", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $refUser;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $pays;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $ville;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $sexe;
    

    /**
     * @ORM\Column(type="integer")
     */
    private $age;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $travail;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $niveauscolaire;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $telephone;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $piece;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isValide;

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

    public function setLibelle(?string $libelle): self
    {
        $this->libelle = $libelle;

        return $this;
    }

    public function getDevise(): ?string
    {
        return $this->devise;
    }

    public function setDevise(?string $devise): self
    {
        $this->devise = $devise;

        return $this;
    }

    public function getFiscalite(): ?string
    {
        return $this->fiscalite;
    }

    public function setFiscalite(?string $fiscalite): self
    {
        $this->fiscalite = $fiscalite;

        return $this;
    }

    public function getSuprimer(): ?bool
    {
        return $this->suprimer;
    }

    public function setSuprimer(bool $suprimer): self
    {
        $this->suprimer = $suprimer;

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

    public function getPays(): ?string
    {
        return $this->pays;
    }

    public function setPays(string $pays): self
    {
        $this->pays = $pays;

        return $this;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function setVille(string $ville): self
    {
        $this->ville = $ville;

        return $this;
    }

    public function getSexe(): ?string
    {
        return $this->sexe;
    }

    public function setSexe(string $sexe): self
    {
        $this->sexe = $sexe;

        return $this;
    }

    public function getAge(): ?string
    {
        return $this->age;
    }

    public function setAge(string $age): self
    {
        $this->age = $age;

        return $this;
    }

   
    public function getTravail(): ?string
    {
        return $this->travail;
    }

    public function setTravail(string $travail): self
    {
        $this->travail = $travail;

        return $this;
    }

    public function getNiveauscolaire(): ?string
    {
        return $this->niveauscolaire;
    }

    public function setNiveauscolaire(string $niveauscolaire): self
    {
        $this->niveauscolaire = $niveauscolaire;

        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(string $telephone): self
    {
        $this->telephone = $telephone;

        return $this;
    }

    public function getPiece(): ?string
    {
        return $this->piece;
    }

    public function setPiece(string $piece): self
    {
        $this->piece = $piece;

        return $this;
    }

    public function getIsValide(): ?bool
    {
        return $this->isValide;
    }

    public function setIsValide(bool $isValide): self
    {
        $this->isValide = $isValide;

        return $this;
    }

    public function __toString(): ?string
    {
        return $this->getLibelle();
    }

    public function getEstSuspecter(): ?bool
    {
        return $this->estSuspecter;
    }

    public function setEstSuspecter(?bool $estSuspecter): self
    {
        $this->estSuspecter = $estSuspecter;

        return $this;
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
