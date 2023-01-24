export type Bonkinator = {
  version: "0.1.0";
  name: "bonkinator";
  instructions: [
    {
      name: "buyTweet";
      accounts: [
        {
          name: "buyer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "buyerBonkAcc";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tweet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "treasury";
          isMut: true;
          isSigner: false;
        },
        {
          name: "bonkMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "tweetId";
          type: "string";
        }
      ];
    },
    {
      name: "createBonkTokenAccount";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "treasury";
          isMut: true;
          isSigner: false;
        },
        {
          name: "bonkMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "tweet";
      type: {
        kind: "struct";
        fields: [
          {
            name: "tweetId";
            type: "string";
          },
          {
            name: "owner";
            type: {
              option: "publicKey";
            };
          },
          {
            name: "price";
            type: {
              option: "u64";
            };
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "NotEnoughBonk";
      msg: "You don't have enough bonk!";
    },
    {
      code: 6001;
      name: "WrongSellerTokenAccount";
      msg: "Wrong seller token account!";
    },
    {
      code: 6002;
      name: "WrongBonkTokenMint";
      msg: "Wrong bonk token mint";
    },
    {
      code: 6003;
      name: "AlreadyOwner";
      msg: "You already own the tweet";
    },
    {
      code: 6004;
      name: "NotABonkTokenAccount";
      msg: "Remaining account isn't sellers token account";
    }
  ];
};

export const IDL: Bonkinator = {
  version: "0.1.0",
  name: "bonkinator",
  instructions: [
    {
      name: "buyTweet",
      accounts: [
        {
          name: "buyer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "buyerBonkAcc",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tweet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "treasury",
          isMut: true,
          isSigner: false,
        },
        {
          name: "bonkMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "tweetId",
          type: "string",
        },
      ],
    },
    {
      name: "createBonkTokenAccount",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "treasury",
          isMut: true,
          isSigner: false,
        },
        {
          name: "bonkMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "tweet",
      type: {
        kind: "struct",
        fields: [
          {
            name: "tweetId",
            type: "string",
          },
          {
            name: "owner",
            type: {
              option: "publicKey",
            },
          },
          {
            name: "price",
            type: {
              option: "u64",
            },
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "NotEnoughBonk",
      msg: "You don't have enough bonk!",
    },
    {
      code: 6001,
      name: "WrongSellerTokenAccount",
      msg: "Wrong seller token account!",
    },
    {
      code: 6002,
      name: "WrongBonkTokenMint",
      msg: "Wrong bonk token mint",
    },
    {
      code: 6003,
      name: "AlreadyOwner",
      msg: "You already own the tweet",
    },
    {
      code: 6004,
      name: "NotABonkTokenAccount",
      msg: "Remaining account isn't sellers token account",
    },
  ],
};
