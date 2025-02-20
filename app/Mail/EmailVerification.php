<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailVerification extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->view('media.email-verification')
            ->with([
                'verificationCode' => $this->data['code'],
                'verificationUrl' => $this->data['verificationUrl']
            ])
            ->subject('Подтверждение email адреса');
    }
}
