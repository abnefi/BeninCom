<?php

namespace App\Repository;

use App\Entity\DetailsProduit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method DetailsProduit|null find($id, $lockMode = null, $lockVersion = null)
 * @method DetailsProduit|null findOneBy(array $criteria, array $orderBy = null)
 * @method DetailsProduit[]    findAll()
 * @method DetailsProduit[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DetailsProduitRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DetailsProduit::class);
    }

    // /**
    //  * @return DetailsProduit[] Returns an array of DetailsProduit objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('d.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?DetailsProduit
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
