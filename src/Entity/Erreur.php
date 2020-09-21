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
}
