// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AMM {
    IERC20 private _tokenX;
    IERC20 private _tokenY;
    uint256 public totalShare; // total amount of share
    mapping(address => uint256) public share; // share by user
    mapping(IERC20 => uint256) public totalAmount; // amount of each token locked in pool

    uint256 public constant PRECISION = 1_000_000; // constant used for share accuracy (= 6 digits)

    constructor(IERC20 tokenX, IERC20 tokenY) {
        _tokenX = tokenX;
        _tokenY = tokenY;
    }

    // Liquidity check
    modifier activePool() {
        require(totalShare > 0, "Zero Liquidity");
        _;
    }

    // Verify token that can be handled by smart contract

    modifier validToken(IERC20 token) {
        require(
            token == _tokenX || token == _tokenY,
            "Token is not in the pool"
        );
        _;
    }

    modifier validTokens(IERC20 tokenX, IERC20 tokenY) {
        require(
            tokenX == _tokenX || tokenY == _tokenY,
            "Token is not in the pool"
        );
        require(
            tokenY == _tokenX || tokenY == _tokenY,
            "Token is not in the pool"
        );
        require(tokenX != tokenY, "Tokens should be different!");
        _;
    }

    // return pair token
    function _pairToken(
        IERC20 token
    ) private view validToken(token) returns (IERC20) {
        if (token == _tokenX) {
            return _tokenY;
        } else {
            return _tokenY;
        }
    }

    // return amount of token that is equal parameter's token
    function getEquivalentToken(
        IERC20 inToken,
        uint256 amountIn
    ) public view activePool validToken(inToken) returns (uint256) {
        IERC20 outToken = _pairToken(inToken);

        return (totalAmount[outToken] * amountIn) / totalAmount[inToken];
    }

    function provide(
        IERC20 tokenX,
        uint256 amountX,
        IERC20 tokenY,
        uint256 amountY
    ) external validTokens(tokenX, tokenY) returns (uint256) {
        require(amountX > 0, "Amount cannot be zero!");
        require(amountY > 0, "Amount cannot be zero!");

        uint256 newshare;
        if (totalShare == 0) {
            newshare = 100 * PRECISION;
        } else {
            uint256 shareX = (totalShare * amountX) / totalAmount[tokenX];
            uint256 shareY = (totalShare * amountY) / totalAmount[tokenY];
            require(
                shareX == shareY,
                "Equivalent value of tokens not provided..."
            );
            newshare = shareX;
        }

        require(
            newshare > 0,
            "Asset value less than threshold for contribution!"
        );
        tokenX.transferFrom(msg.sender, address(this), amountX);
        tokenY.transferFrom(msg.sender, address(this), amountY);

        totalAmount[tokenX] += amountX;
        totalAmount[tokenY] += amountY;

        totalShare += newshare;
        share[msg.sender] += newshare;

        return newshare;
    }

    function getWithdrawEstimate(
        IERC20 token,
        uint256 _share
    ) public view activePool validToken(token) returns (uint256) {
        require(_share <= totalShare, "Share should be less than totalShare");
        return (_share * totalAmount[token]) / totalShare;
    }

    function withdraw(
        uint256 _share
    ) external activePool returns (uint256, uint256) {
        require(_share > 0, "share cannot be zero!");
        require(_share <= share[msg.sender], "Insufficient share");

        uint256 amountTokenX = getWithdrawEstimate(_tokenX, _share);
        uint256 amountTokenY = getWithdrawEstimate(_tokenY, _share);

        share[msg.sender] -= _share;
        totalShare -= _share;

        totalAmount[_tokenX] -= amountTokenX;
        totalAmount[_tokenY] -= amountTokenY;

        _tokenX.transfer(msg.sender, amountTokenX);
        _tokenY.transfer(msg.sender, amountTokenY);

        return (amountTokenX, amountTokenY);
    }
}
