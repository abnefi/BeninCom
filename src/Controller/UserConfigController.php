<?php

namespace App\Controller;

use App\Entity\UserConfig;
use App\Form\UserConfigType;
use App\Repository\UserConfigRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/user/config")
 */
class UserConfigController extends AbstractController
{
    /**
     * @Route("/", name="user_config_index", methods={"GET"})
     */
    public function index(UserConfigRepository $userConfigRepository): Response
    {
        return $this->render('user_config/index.html.twig', [
            'user_configs' => $userConfigRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="user_config_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $userConfig = new UserConfig();
        $form = $this->createForm(UserConfigType::class, $userConfig);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($userConfig);
            $entityManager->flush();

            return $this->redirectToRoute('user_config_index');
        }

        return $this->render('user_config/new.html.twig', [
            'user_config' => $userConfig,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="user_config_show", methods={"GET"})
     */
    public function show(UserConfig $userConfig): Response
    {
        return $this->render('user_config/show.html.twig', [
            'user_config' => $userConfig,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="user_config_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, UserConfig $userConfig): Response
    {
        $form = $this->createForm(UserConfigType::class, $userConfig);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('user_config_index');
        }

        return $this->render('user_config/edit.html.twig', [
            'user_config' => $userConfig,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="user_config_delete", methods={"DELETE"})
     */
    public function delete(Request $request, UserConfig $userConfig): Response
    {
        if ($this->isCsrfTokenValid('delete'.$userConfig->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($userConfig);
            $entityManager->flush();
        }

        return $this->redirectToRoute('user_config_index');
    }
}
