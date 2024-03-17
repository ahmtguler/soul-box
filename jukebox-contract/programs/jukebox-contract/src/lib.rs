use anchor_lang::prelude::*;
declare_id!("EG3Gd4dyutGQdUWrh2CUS8kMXbhybfRm15Yc7HsfeQN");

#[program]
pub mod anchor_jukebox {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, add_fee: u64, fee_receiver_pubkey: Pubkey) -> Result<()> { 
        let add_to_que = &mut ctx.accounts.add_to_que;
        add_to_que.fee = add_fee;

        let fee_receiver = &mut ctx.accounts.fee_receiver;
        fee_receiver.pubkey = fee_receiver_pubkey;

        let owner = &mut ctx.accounts.owner;
        owner.pubkey = *ctx.accounts.user.key;

        Ok(())
    }

    pub fn add_song(ctx: Context<AddSong>, song: Song) -> Result<()> {
        let add_to_que = &ctx.accounts.add_to_que;
        let fee_receiver = &ctx.accounts.fee_receiver;

        let from = &ctx.accounts.user.to_account_info();
        let to = &fee_receiver.to_account_info();
        transfer_fee(from, to, add_to_que.fee)?;

        emit!(SongAdded {
            title: song.title,
            artist: song.artist,
        });

        Ok(())
    }

    pub fn set_add_to_que_fee(ctx: Context<SetAddToQueFee>, fee: u64) -> Result<()> {
        let owner = &ctx.accounts.owner.pubkey;
        let user = ctx.accounts.user.key;
        assert_eq!(owner, user);

        let add_to_que = &mut ctx.accounts.add_to_que;
        add_to_que.fee = fee;

        Ok(())
    }

    pub fn set_fee_receiver(ctx: Context<SetFeeReceiver>, pubkey: Pubkey) -> Result<()> {
        let owner = &ctx.accounts.owner.pubkey;
        let user = ctx.accounts.user.key;
        assert_eq!(owner, user);

        let fee_receiver = &mut ctx.accounts.fee_receiver;
        fee_receiver.pubkey = pubkey;

        Ok(())
    }

    pub fn transfer_ownership(ctx: Context<TransferOwnership>, new_owner: Pubkey) -> Result<()> {
        let owner = &ctx.accounts.owner.pubkey;
        let user = ctx.accounts.user.key;
        assert_eq!(owner, user);
        assert_ne!(owner, &new_owner);

        let owner = &mut ctx.accounts.owner;
        owner.pubkey = new_owner;

        Ok(())
    }
}

fn transfer_fee(from: &AccountInfo, to: &AccountInfo, fee: u64) -> Result<()> {
    let from_lamports = from.lamports();
    let to_lamports = to.lamports();

    **from.try_borrow_mut_lamports()? -= fee;
    **to.try_borrow_mut_lamports()? += fee;

    assert_eq!(from_lamports - fee, from.lamports());
    assert_eq!(to_lamports + fee, to.lamports());

    Ok(())
}

#[derive(Accounts)]
#[instruction(params: (u64, u64, Pubkey))]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init, 
        payer = user, space = 8 + 
        AddToQue::INIT_SPACE + 
        FeeReceiver::INIT_SPACE + 
        Owner::INIT_SPACE
    )]
    pub add_to_que: Account<'info, AddToQue>,
    pub fee_receiver: Account<'info, FeeReceiver>,
    pub owner: Account<'info, Owner>,

    pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
#[instruction(params: Song)]
pub struct AddSong<'info> {
    #[account(signer)]
    pub user: Signer<'info>,

    pub add_to_que: Account<'info, AddToQue>,
    pub fee_receiver: Account<'info, FeeReceiver>,
}

#[derive(Accounts)]
#[instruction(params: u64)]
pub struct SetAddToQueFee<'info> {
    #[account(signer)]
    pub user: Signer<'info>,
    pub owner: Account<'info, Owner>,
    pub add_to_que: Account<'info, AddToQue>,
}

#[derive(Accounts)]
#[instruction(params: Pubkey)]
pub struct SetFeeReceiver<'info> {
    #[account(signer)]
    pub user: Signer<'info>,
    pub owner: Account<'info, Owner>,
    pub fee_receiver: Account<'info, FeeReceiver>,
}

#[derive(Accounts)]
#[instruction(params: Pubkey)]
pub struct TransferOwnership<'info> {
    #[account(signer)]
    pub user: Signer<'info>,
    pub owner: Account<'info, Owner>,
}

#[account]
#[derive(InitSpace)]
pub struct AddToQue {
    pub fee: u64,
}

#[account]
#[derive(InitSpace)]
pub struct FeeReceiver {
    pub pubkey: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct Owner {
    pub pubkey: Pubkey,
}

#[derive(AnchorDeserialize, AnchorSerialize, Clone, Debug, Eq, PartialOrd, PartialEq)]
pub struct Song {
    pub title: String,
    pub artist: String,
}

#[event]
pub struct SongAdded {
    pub title: String,
    pub artist: String,
}