<?php

namespace App\Controller;

use App\Entity\ConfigTypeUser;
use App\Form\ConfigTypeUserType;
use App\Repository\ConfigTypeUserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/config/type/user")
 */
class ConfigTypeUserController extends AbstractController
{
    /**
     * @Route("/", name="config_type_user_index", methods={"GET"})
     */
    public function index(ConfigTypeUserRepository $configTypeUserRepository): Response
    {
        return $this->render('config_type_user/index.html.twig', [
            'config_type_users' => $configTypeUserRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="config_type_user_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $configTypeUser = new ConfigTypeUser();
        $form = $this->createForm(ConfigTypeUserType::class, $configTypeUser);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($configTypeUser);
            $entityManager->flush();

            return $this->redirectToRoute('config_type_user_index');
        }

        return $this->render('config_type_user/new.html.twig', [
            'config_type_user' => $configTypeUser,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="config_type_user_show", methods={"GET"})
     */
    public function show(ConfigTypeUser $configTypeUser): Response
    {
        return $this->render('config_type_user/show.html.twig', [
            'config_type_user' => $configTypeUser,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="config_type_user_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, ConfigTypeUser $configTypeUser): Response
    {
        $form = $this->createForm(ConfigTypeUserType::class, $configTypeUser);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('config_type_user_index');
        }

        return $this->render('config_type_user/edit.html.twig', [
            'config_type_user' => $configTypeUser,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="config_type_user_delete", methods={"DELETE"})
     */
    public function delete(Request $request, ConfigTypeUser $configTypeUser): Response
    {
        if ($this->isCsrfTokenValid('delete'.$configTypeUser->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($configTypeUser);
            $entityManager->flush();
        }

        return $this->redirectToRoute('config_type_user_index');
    }
}
