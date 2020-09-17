<?php

namespace App\Controller;

use App\Entity\DetailsProduit;
use App\Form\DetailsProduitType;
use App\Repository\DetailsProduitRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/details/produit")
 */
class DetailsProduitController extends AbstractController
{
    /**
     * @Route("/", name="details_produit_index", methods={"GET"})
     */
    public function index(DetailsProduitRepository $detailsProduitRepository): Response
    {
        return $this->render('details_produit/index.html.twig', [
            'details_produits' => $detailsProduitRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="details_produit_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $detailsProduit = new DetailsProduit();
        $form = $this->createForm(DetailsProduitType::class, $detailsProduit);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($detailsProduit);
            $entityManager->flush();

            return $this->redirectToRoute('details_produit_index');
        }

        return $this->render('details_produit/new.html.twig', [
            'details_produit' => $detailsProduit,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="details_produit_show", methods={"GET"})
     */
    public function show(DetailsProduit $detailsProduit): Response
    {
        return $this->render('details_produit/show.html.twig', [
            'details_produit' => $detailsProduit,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="details_produit_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, DetailsProduit $detailsProduit): Response
    {
        $form = $this->createForm(DetailsProduitType::class, $detailsProduit);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('details_produit_index');
        }

        return $this->render('details_produit/edit.html.twig', [
            'details_produit' => $detailsProduit,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="details_produit_delete", methods={"DELETE"})
     */
    public function delete(Request $request, DetailsProduit $detailsProduit): Response
    {
        if ($this->isCsrfTokenValid('delete'.$detailsProduit->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($detailsProduit);
            $entityManager->flush();
        }

        return $this->redirectToRoute('details_produit_index');
    }
}
