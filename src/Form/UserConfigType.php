<?php

namespace App\Form;

use App\Entity\UserConfig;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserConfigType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('libelle')
            ->add('devise')
            ->add('fiscalite')
            ->add('suprimer')
            ->add('estSusper')
            ->add('pays')
            ->add('ville')
            ->add('sexe')
            ->add('age')
            ->add('travail')
            ->add('niveauscolaire')
            ->add('telephone')
            ->add('piece')
            ->add('isValide')
            ->add('refUser')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => UserConfig::class,
        ]);
    }
}
