<?php

namespace App\Form;

use App\Entity\ConfigTypeUser;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ConfigTypeUserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('libelle')
            ->add('texteAcueil')
            ->add('texteBienvenu')
            ->add('texteBonus')
            ->add('texteReferal')
            ->add('textePub')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => ConfigTypeUser::class,
        ]);
    }
}
