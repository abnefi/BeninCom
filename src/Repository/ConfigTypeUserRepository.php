<?php

namespace App\Repository;

use App\Entity\ConfigTypeUser;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ConfigTypeUser|null find($id, $lockMode = null, $lockVersion = null)
 * @method ConfigTypeUser|null findOneBy(array $criteria, array $orderBy = null)
 * @method ConfigTypeUser[]    findAll()
 * @method ConfigTypeUser[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ConfigTypeUserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ConfigTypeUser::class);
    }

    // /**
    //  * @return ConfigTypeUser[] Returns an array of ConfigTypeUser objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ConfigTypeUser
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
