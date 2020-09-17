<?php

namespace App\Controller;

use App\Entity\TypeUser;
use App\Form\TypeUserType;
use App\Repository\TypeUserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/type/user")
 */
class TypeUserController extends AbstractController
{
    /**
     * @Route("/", name="type_user_index", methods={"GET"})
     */
    public function index(TypeUserRepository $typeUserRepository): Response
    {
        return $this->render('type_user/index.html.twig', [
            'type_users' => $typeUserRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="type_user_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $typeUser = new TypeUser();
        $form = $this->createForm(TypeUserType::class, $typeUser);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($typeUser);
            $entityManager->flush();

            return $this->redirectToRoute('type_user_index');
        }

        return $this->render('type_user/new.html.twig', [
            'type_user' => $typeUser,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="type_user_show", methods={"GET"})
     */
    public function show(TypeUser $typeUser): Response
    {
        return $this->render('type_user/show.html.twig', [
            'type_user' => $typeUser,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="type_user_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, TypeUser $typeUser): Response
    {
        $form = $this->createForm(TypeUserType::class, $typeUser);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('type_user_index');
        }

        return $this->render('type_user/edit.html.twig', [
            'type_user' => $typeUser,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="type_user_delete", methods={"DELETE"})
     */
    public function delete(Request $request, TypeUser $typeUser): Response
    {
        if ($this->isCsrfTokenValid('delete'.$typeUser->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($typeUser);
            $entityManager->flush();
        }

        return $this->redirectToRoute('type_user_index');
    }
}
