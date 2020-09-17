<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class PageAdvertiserController extends AbstractController
{
    /**
     * @Route("/page/advertiser", name="page_advertiser")
     */
    public function index()
    {
        return $this->render('page_advertiser/index.html.twig', [
            'controller_name' => 'PageAdvertiserController',
        ]);
    }
}
