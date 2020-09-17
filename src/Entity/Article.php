<?php

namespace App\Entity;

use App\Repository\ArticleRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ArticleRepository::class)

 */
class Article
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
     * @ORM\Column(type="string", length=255)
     */
    private $lienarticle;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $texte;


    /**
     * @ORM\Column(type="boolean")
     */
    private $estcliker;

    /**
     * @ORM\Column(type="time")
     */
    private $time;

    /**
     * @ORM\ManyToOne(targetEntity=Produit::class, inversedBy="refArticles")
     * @ORM\JoinColumn(nullable=false)
     */
    private $refProduit;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="refArticles")
     * @ORM\JoinColumn(nullable=false)
     */
    private $refUser;
    
    /**
     * @ORM\Column(type="datetime")
     *
     */
    private $created;




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

    public function getLienarticle(): ?string
    {
        return $this->lienarticle;
    }

    public function setLienarticle(string $lienarticle): self
    {
        $this->lienarticle = $lienarticle;

        return $this;
    }

    public function getTexte(): ?string
    {
        return $this->texte;
    }

    public function setTexte(string $texte): self
    {
        $this->texte = $texte;

        return $this;
    }

    public function getRefProduit(): ?string
    {
        return $this->refProduit;
    }

    public function setRefProduit(string $refProduit): self
    {
        $this->refProduit = $refProduit;

        return $this;
    }

    public function getEstcliker(): ?bool
    {
        return $this->estcliker;
    }

    public function setEstcliker(bool $estcliker): self
    {
        $this->estcliker = $estcliker;

        return $this;
    }

    public function getTime(): ?\DateTimeInterface
    {
        return $this->time;
    }

    public function setTime(\DateTimeInterface $time): self
    {
        $this->time = $time;

        return $this;
    }

    public function getRefUser(): ?User
    {
        return $this->refUser;
    }

    public function setRefUser(?User $refUser): self
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
