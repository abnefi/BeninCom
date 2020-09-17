<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username',TextType::class,
            [
                'row_attr' => ['class' => 'form-control','empty_data' => 'John Doe', 'id' => 'register-form-username','aria-required'=>'true','name'=>'register-form[Pseudo]'],
                'attr' =>['require' =>true]

            ])
            ->add('email',EmailType::class,
                [
                    'row_attr' => ['class' => 'form-control', 'id' => 'register-form-email','aria-required'=>'true','name'=>'register-form[email]'],
                    'attr' =>['require' =>true]
                ])
            ->add('password',PasswordType::class,
                [
                    'row_attr' => ['class' => 'form-control', 'id' => 'register-form-password','aria-required'=>'true','name'=>'register-form[password]'],
                    'attr' =>['require' =>true]
                ])
            ->add('accorder', CheckboxType::class,
                [
                    'label'=>' ',
                    'row_attr' => ['id' => 'popup_form__agree1'],
                    'attr' =>['require' =>true]
                ])
            ->add('enregistrer',SubmitType::class,
                [
                    'label'=>'Créer mon compte',
                    'row_attr' => ['align' => 'center'],
                ]
            )


        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
