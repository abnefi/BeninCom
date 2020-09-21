<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class PageUserController extends AbstractController
{
    /**
     * @Route("/page/user", name="page_user")
     */
    public function index()
    {
        return $this->render('page_user/monuser.html.twig', [
            'controller_name' => 'PageUserController',
        ]);
    }
}
