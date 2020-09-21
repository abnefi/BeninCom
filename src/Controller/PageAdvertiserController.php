<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class PageAdvertiserController extends AbstractController
{
    /**
     * @Route("/page/entreprise", name="page_entreprise")
     */
    public function index()
    {
        return $this->render('page_advertiser/entreprise.html.twig', [
            'controller_name' => 'PageAdvertiserController',
        ]);
    }
}
