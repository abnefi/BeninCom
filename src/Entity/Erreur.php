<?php

namespace App\Entity;

use App\Repository\ErreurRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ErreurRepository::class)
 */
class Erreur
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
    private $codeErreur;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $libelleErreur;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $libelleOperation;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateOperation;


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

    public function getCodeErreur(): ?string
    {
        return $this->codeErreur;
    }

    public function setCodeErreur(string $codeErreur): self
    {
        $this->codeErreur = $codeErreur;

        return $this;
    }

    public function getLibelleErreur(): ?string
    {
        return $this->libelleErreur;
    }

    public function setLibelleErreur(string $libelleErreur): self
    {
        $this->libelleErreur = $libelleErreur;

        return $this;
    }

    public function getLibelleOperation(): ?string
    {
        return $this->libelleOperation;
    }

    public function setLibelleOperation(string $libelleOperation): self
    {
        $this->libelleOperation = $libelleOperation;

        return $this;
    }

    public function getDateOperation(): ?\DateTimeInterface
    {
        return $this->dateOperation;
    }

    public function setDateOperation(\DateTimeInterface $dateOperation): self
    {
        $this->dateOperation = $dateOperation;

        return $this;
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
