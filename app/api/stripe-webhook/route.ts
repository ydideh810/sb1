import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return new NextResponse('No signature', { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      // Add credits to user's account
      const supabase = createRouteHandlerClient({ cookies });

      const { error } = await supabase.rpc('add_credits', {
        add_amount: Number(session.metadata?.credits || 0),
        user_id: session.metadata?.userId
      });

      if (error) {
        console.error('Error adding credits:', error);
        return new NextResponse('Error processing credits', { status: 500 });
      }
    }

    return new NextResponse('Webhook processed', { status: 200 });
  } catch (error) {
    return new NextResponse(
      'Webhook error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      { status: 400 }
    );
  }
}
