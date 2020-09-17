<?php

namespace App\Entity;


use App\Repository\ProduitRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ProduitRepository::class)
 *
 */
class Produit
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
    private $titre;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $libelle;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $lien;

    /**
     * @ORM\Column(type="datetime")
     *
     */
    private $created;


    /**
     * @ORM\Column(type="string", length=255)
     */
    private $image;


    /**
     * @ORM\OneToMany(targetEntity=Article::class, mappedBy="refProduit")
     */
    private $refArticles;

    /**
     * @ORM\OneToOne(targetEntity=DetailsProduit::class, mappedBy="refProduit", cascade={"persist", "remove"})
     */
    private $refDetaisproduit;

    public function __construct()
    {
        $this->refArticles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): self
    {
        $this->titre = $titre;

        return $this;
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

    public function getLien(): ?string
    {
        return $this->lien;
    }

    public function setLien(string $lien): self
    {
        $this->lien = $lien;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(string $image): self
    {
        $this->image = $image;

        return $this;
    }

    public function getRefArticle(): ?string
    {
        return $this->refArticle;
    }

    public function setRefArticle(string $refArticle): self
    {
        $this->refArticle = $refArticle;

        return $this;
    }

    /**
     * @return Collection|Article[]
     */
    public function getRefArticles(): Collection
    {
        return $this->refArticles;
    }

    public function addRefArticle(Article $refArticle): self
    {
        if (!$this->refArticles->contains($refArticle)) {
            $this->refArticles[] = $refArticle;
            $refArticle->setRefProduit($this);
        }

        return $this;
    }

    public function removeRefArticle(Article $refArticle): self
    {
        if ($this->refArticles->contains($refArticle)) {
            $this->refArticles->removeElement($refArticle);
            // set the owning side to null (unless already changed)
            if ($refArticle->getRefProduit() === $this) {
                $refArticle->setRefProduit(null);
            }
        }

        return $this;
    }

    public function getRefDetaisproduit(): ?DetailsProduit
    {
        return $this->refDetaisproduit;
    }

    public function setRefDetaisproduit(DetailsProduit $refDetaisproduit): self
    {
        $this->refDetaisproduit = $refDetaisproduit;

        // set the owning side of the relation if necessary
        if ($refDetaisproduit->getRefProduit() !== $this) {
            $refDetaisproduit->setRefProduit($this);
        }

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
