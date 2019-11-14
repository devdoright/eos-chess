#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <string>

namespace Game {
    using namespace eosio;
    using std::string;

    class Chess : public contract {
        using contract::contract;

    public:

        Chess(account_name self): contract(self){}

        //@abi action for setting status of the account
        void setstat(account_name account, string status);
    };

    EOSIO_ABI(Chess, (setstat));
}