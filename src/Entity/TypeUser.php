<?php

namespace App\Entity;


use App\Repository\TypeUserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Entity(repositoryClass=TypeUserRepository::class)
 */
class TypeUser
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
     * @ORM\Column(type="integer", nullable=true)
     */
    private $totaluser;

    /**
     * @ORM\OneToMany(targetEntity=User::class, mappedBy="refTypeuser")
     */
    private $refUser;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $observations;

    /**
     * @ORM\OneToOne(targetEntity=ConfigTypeUser::class, cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $refConfigTypeUser;


   

    public function __construct()
    {
        $this->refUser = new ArrayCollection();
    }

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

    public function getTotaluser(): ?int
    {
        return $this->totaluser;
    }

    public function setTotaluser(?int $totaluser): self
    {
        $this->totaluser = $totaluser;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getRefUser(): Collection
    {
        return $this->refUser;
    }

    public function addRefUser(User $refUser): self
    {
        if (!$this->refUser->contains($refUser)) {
            $this->refUser[] = $refUser;
            $refUser->setRefTypeuser($this);
        }

        return $this;
    }

    public function removeRefUser(User $refUser): self
    {
        if ($this->refUser->contains($refUser)) {
            $this->refUser->removeElement($refUser);
            // set the owning side to null (unless already changed)
            if ($refUser->getRefTypeuser() === $this) {
                $refUser->setRefTypeuser(null);
            }
        }

        return $this;
    }

    public function getObservations(): ?string
    {
        return $this->observations;
    }

    public function setObservations(?string $observations): self
    {
        $this->observations = $observations;

        return $this;
    }

    public function getRefConfigTypeUser(): ?ConfigTypeUser
    {
        return $this->refConfigTypeUser;
    }

    public function setRefConfigTypeUser(ConfigTypeUser $refConfigTypeUser): self
    {
        $this->refConfigTypeUser = $refConfigTypeUser;

        return $this;
    }


    public function __toString(): ?string
    {
        return $this->getLibelle();
    }
}
