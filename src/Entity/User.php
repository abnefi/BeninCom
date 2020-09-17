<?php

namespace App\Entity;


use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 *
 *
 * @UniqueEntity(fields={"username"}, message="There is already an account with this username")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=255)
     
     */
    private $firsname;

    /**
     * @ORM\Column(type="string", length=255)

     */
    private $lasname;


    /**
     * @ORM\Column(type="boolean")

     */
    private $accorder;

    /**
     * @ORM\OneToOne(targetEntity=UserConfig::class, mappedBy="refUser", cascade={"persist", "remove"})
     */
    private $refUserconfig;

    /**
     * @ORM\OneToMany(targetEntity=Paiement::class, mappedBy="refUser")
     */
    private $refPaiements;

    /**
     * @ORM\OneToMany(targetEntity=Article::class, mappedBy="refUser")
     */
    private $refArticles;

    /**
     * @ORM\OneToOne(targetEntity=Compte::class, mappedBy="refUser", cascade={"persist", "remove"})
     */
    private $refCompte;

    /**
     * @ORM\ManyToOne(targetEntity=TypeUser::class, inversedBy="refUser")
     */
    private $refTypeuser;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isVerified = false;

    public function __construct()
    {
        $this->refPaiements = new ArrayCollection();
        $this->refArticles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getFirsname(): ?string
    {
        return $this->firsname;
    }

    public function setFirsname(string $firsname): self
    {
        $this->firsname = $firsname;

        return $this;
    }

    public function getLasname(): ?string
    {
        return $this->lasname;
    }

    public function setLasname(string $lasname): self
    {
        $this->lasname = $lasname;

        return $this;
    }

    public function getRefUserconfig(): ?UserConfig
    {
        return $this->refUserconfig;
    }

    public function setRefUserconfig(UserConfig $refUserconfig): self
    {
        $this->refUserconfig = $refUserconfig;

        // set the owning side of the relation if necessary
        if ($refUserconfig->getRefUser() !== $this) {
            $refUserconfig->setRefUser($this);
        }

        return $this;
    }

    /**
     * @return Collection|Paiement[]
     */
    public function getRefPaiements(): Collection
    {
        return $this->refPaiements;
    }

    public function addRefPaiement(Paiement $refPaiement): self
    {
        if (!$this->refPaiements->contains($refPaiement)) {
            $this->refPaiements[] = $refPaiement;
            $refPaiement->setRefUser($this);
        }

        return $this;
    }

    public function removeRefPaiement(Paiement $refPaiement): self
    {
        if ($this->refPaiements->contains($refPaiement)) {
            $this->refPaiements->removeElement($refPaiement);
            // set the owning side to null (unless already changed)
            if ($refPaiement->getRefUser() === $this) {
                $refPaiement->setRefUser(null);
            }
        }

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
            $refArticle->setRefUser($this);
        }

        return $this;
    }

    public function removeRefArticle(Article $refArticle): self
    {
        if ($this->refArticles->contains($refArticle)) {
            $this->refArticles->removeElement($refArticle);
            // set the owning side to null (unless already changed)
            if ($refArticle->getRefUser() === $this) {
                $refArticle->setRefUser(null);
            }
        }

        return $this;
    }

    public function getRefCompte(): ?Compte
    {
        return $this->refCompte;
    }

    public function setRefCompte(Compte $refCompte): self
    {
        $this->refCompte = $refCompte;

        // set the owning side of the relation if necessary
        if ($refCompte->getRefUser() !== $this) {
            $refCompte->setRefUser($this);
        }

        return $this;
    }

    public function getRefTypeuser(): ?TypeUser
    {
        return $this->refTypeuser;
    }

    public function setRefTypeuser(?TypeUser $refTypeuser): self
    {
        $this->refTypeuser = $refTypeuser;

        return $this;
    }


    public function getAccorder(): ?bool
    {
        return $this->accorder;
    }

    public function setAccorder(bool $accorder): self
    {
        $this->accorder = $accorder;

        return $this;
    }


    public function __toString(): ?string
    {
        return $this->getUsername();
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): self
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function getIsVerified(): ?bool
    {
        return $this->isVerified;
    }
}